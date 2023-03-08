import type { APIRoute } from 'astro'
import { generatePayload, parseOpenAIStream } from '@/utils/openAI'
// #vercel-disable-blocks
import { fetch, ProxyAgent } from 'undici'
// #vercel-end

const apiKey = process.env.OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY
const https_proxy = import.meta.env.HTTPS_PROXY

export const post: APIRoute = async (context) => {
  const body = await context.request.json()
  const messages = body.messages

  if (!messages) {
    return new Response('No input text')
  }
  console.log("request role", messages[messages.length - 1]?.role)
  messages[messages.length - 2] && console.log("request message：", messages[messages.length - 2].content)
  console.log("request message：", messages[messages.length - 1]?.content)
  const initOptions = generatePayload(body.key || apiKey, messages)
  // #vercel-disable-blocks
  if (https_proxy) {
    initOptions['dispatcher'] = new ProxyAgent(https_proxy)
  }
  // #vercel-end

  // @ts-ignore
  const response = await fetch('https://api.openai.com/v1/chat/completions', initOptions) as Response

  return new Response(parseOpenAIStream(response))
}
