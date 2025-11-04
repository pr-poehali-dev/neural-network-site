import json
import os
import urllib.request
import urllib.parse
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Поиск информации в интернете через Perplexity AI
    Args: event с httpMethod, body (JSON с полем query)
          context с request_id
    Returns: HTTP response с результатами поиска
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    api_key = os.environ.get('PERPLEXITY_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'API key not configured'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    query = body_data.get('query', '').strip()
    
    if not query:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Query is required'}),
            'isBase64Encoded': False
        }
    
    payload = json.dumps({
        'model': 'llama-3.1-sonar-small-128k-online',
        'messages': [
            {
                'role': 'system',
                'content': 'Ты полезный ассистент. Отвечай кратко и по делу на русском языке, используя актуальную информацию из интернета.'
            },
            {
                'role': 'user',
                'content': query
            }
        ],
        'max_tokens': 500,
        'temperature': 0.2,
        'top_p': 0.9,
        'search_domain_filter': ['perplexity.ai'],
        'return_images': False,
        'return_related_questions': False,
        'search_recency_filter': 'month',
        'stream': False
    }).encode('utf-8')
    
    req = urllib.request.Request(
        'https://api.perplexity.ai/chat/completions',
        data=payload,
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        },
        method='POST'
    )
    
    response = urllib.request.urlopen(req, timeout=30)
    response_data = json.loads(response.read().decode('utf-8'))
    
    answer = response_data.get('choices', [{}])[0].get('message', {}).get('content', 'Не удалось получить ответ')
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'answer': answer,
            'query': query
        }, ensure_ascii=False),
        'isBase64Encoded': False
    }
