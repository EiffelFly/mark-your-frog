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

### How to put firebase secret key into vercel env var

When deploy application into vercel, I encountered a weird error on `/api/auth/callback/todoist` route. 

<details>
  <summary>Full error code</summary>

  ```
    [next-auth][error][OAUTH_CALLBACK_HANDLER_ERROR] 
    https://next-auth.js.org/errors#oauth_callback_handler_error 2 UNKNOWN: Getting metadata from plugin failed with error: error:1E08010C:DECODER routines::unsupported Error: 2 UNKNOWN: Getting metadata from plugin failed with error: error:1E08010C:DECODER routines::unsupported
        at callErrorFromStatus (/var/task/node_modules/.pnpm/@grpc+grpc-js@1.8.14/node_modules/@grpc/grpc-js/build/src/call.js:31:19)
        at Object.onReceiveStatus (/var/task/node_modules/.pnpm/@grpc+grpc-js@1.8.14/node_modules/@grpc/grpc-js/build/src/client.js:351:73)
        at Object.onReceiveStatus (/var/task/node_modules/.pnpm/@grpc+grpc-js@1.8.14/node_modules/@grpc/grpc-js/build/src/client-interceptors.js:323:181)
        at /var/task/node_modules/.pnpm/@grpc+grpc-js@1.8.14/node_modules/@grpc/grpc-js/build/src/resolving-call.js:94:78
        at process.processTicksAndRejections (node:internal/process/task_queues:77:11)
    for call at
        at ServiceClientImpl.makeServerStreamRequest (/var/task/node_modules/.pnpm/@grpc+grpc-js@1.8.14/node_modules/@grpc/grpc-js/build/src/client.js:334:34)
        at ServiceClientImpl.<anonymous> (/var/task/node_modules/.pnpm/@grpc+grpc-js@1.8.14/node_modules/@grpc/grpc-js/build/src/make-client.js:105:19)
        at /var/task/node_modules/.pnpm/@google-cloud+firestore@6.6.0/node_modules/@google-cloud/firestore/build/src/v1/firestore_client.js:227:29
        at /var/task/node_modules/.pnpm/google-gax@3.6.0/node_modules/google-gax/build/src/streamingCalls/streamingApiCaller.js:38:28
        at /var/task/node_modules/.pnpm/google-gax@3.6.0/node_modules/google-gax/build/src/normalCalls/timeout.js:44:16
        at Object.request (/var/task/node_modules/.pnpm/google-gax@3.6.0/node_modules/google-gax/build/src/streamingCalls/streaming.js:130:40)
        at Timeout.makeRequest [as _onTimeout] (/var/task/node_modules/.pnpm/retry-request@5.0.2/node_modules/retry-request/index.js:141:28)
        at listOnTimeout (node:internal/timers:569:17)
        at process.processTimers (node:internal/timers:512:7)
    Caused by: Error
        at Query._get (/var/task/node_modules/.pnpm/@google-cloud+firestore@6.6.0/node_modules/@google-cloud/firestore/build/src/reference.js:1717:23)
        at Query.get (/var/task/node_modules/.pnpm/@google-cloud+firestore@6.6.0/node_modules/@google-cloud/firestore/build/src/reference.js:1705:21)
        at getOneDoc (/var/task/apps/app/.next/server/chunks/837.js:290:52)
        at getUserByAccount (/var/task/apps/app/.next/server/chunks/837.js:134:35)
        at _callee2$ (/var/task/node_modules/.pnpm/next-auth@4.22.1_next@13.4.1_react-dom@18.2.0_react@18.2.0/node_modules/next-auth/core/errors.js:365:29)
        at tryCatch (/var/task/node_modules/.pnpm/@babel+runtime@7.21.5/node_modules/@babel/runtime/helpers/regeneratorRuntime.js:44:17)
        at Generator.<anonymous> (/var/task/node_modules/.pnpm/@babel+runtime@7.21.5/node_modules/@babel/runtime/helpers/regeneratorRuntime.js:125:22)
        at Generator.next (/var/task/node_modules/.pnpm/@babel+runtime@7.21.5/node_modules/@babel/runtime/helpers/regeneratorRuntime.js:69:21)
        at asyncGeneratorStep (/var/task/node_modules/.pnpm/@babel+runtime@7.21.5/node_modules/@babel/runtime/helpers/asyncToGenerator.js:3:24)
        at _next (/var/task/node_modules/.pnpm/@babel+runtime@7.21.5/node_modules/@babel/runtime/helpers/asyncToGenerator.js:22:9) {
      name: 'GetUserByAccountError',
      code: 2
    }
  ```
<details/>

I begin to dig into how to solve this problem. I found that the problem is caused by the firebase secret key. I put the secret key into vercel env var, but it seems that the secret key is not correctly parsed.

```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY.........-----END PRIVATE KEY-----\n"
```

You need to copy this line and then directly paste into Vercel. Vercel will automatically replace newline.


- [Vercel/Storing complex secrets](https://github.com/vercel/vercel/issues/749#issuecomment-1323978876)


## Reference

- [Building a GPT-3 app with Next.js and Vercel Edge Functions](https://vercel.com/blog/gpt-3-app-next-js-vercel-edge-functions)
- [Agent GPT](https://github.com/reworkd/AgentGPT)
- [supabase-community/nextjs-openai-doc-search](https://github.com/supabase-community/nextjs-openai-doc-search/)
- [dair-ai/Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)
- [LangChain101: Question A 300 Page Book (w/ OpenAI + Pinecone)](https://www.youtube.com/watch?v=h0DHDp1FbmQ)