## Mark your frog




## Caveat

### TypeError: adapter is not a function

This is an Axios error, because the worker is using an edge runtime. It doesn't support NODE API.

### The inferred type of 'trpc' cannot be named without a reference

```
The inferred type of 'trpc' cannot be named without a reference to '../../../../packages/api/node_modules/@trpc/server/dist'. This is likely not portable. A type annotation is necessary.
```

Detailed explanation: https://github.com/microsoft/TypeScript/issues/47663#issuecomment-1519138189

### Next-Auth jwt callback is not triggered

Make sure your next-auth configuration has this line

```ts
{
  session: { strategy: "jwt" },
}
```


## Reference

- [Building a GPT-3 app with Next.js and Vercel Edge Functions](https://vercel.com/blog/gpt-3-app-next-js-vercel-edge-functions)
- [Agent GPT](https://github.com/reworkd/AgentGPT)
- [supabase-community/nextjs-openai-doc-search](https://github.com/supabase-community/nextjs-openai-doc-search/)
- [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)
- [LangChain101: Question A 300 Page Book (w/ OpenAI + Pinecone)](https://www.youtube.com/watch?v=h0DHDp1FbmQ)