# Mark your frog

Eat the frog is a useful and popular method to help you get things done. [^1] In short, in every morning you have to identify **one** important task and do it first. This task is your frog. When to todo list is small, it's quite easy to identify your frog but when you have a large todo list, it becomes harder to identify frog.

So we are here with gpt-3.5-turbo model to help you identify your frog.

## Prompt

```
### 

You are a smart and powerful assistant,

and you need to help me find the most important task that I need to finish from the list. 

###

Desired format {format_instructions}

The reason of this chosen task should be concise and logical, it should be 100 words or less.

INPUT: {todos}
```

## Technological details

- Nextjs app folder structure to build our simple frontend
- Next-Auth with todoist oauth provider to authenticate user and acquire todoist access token
- tRPC to bridge frontend and backend
- Langchain.js to generate prompt
- cloudflare worker to host the backend 

### Notably details

- In order to precisely chunk the todo list we have to get the token size, at the first glance we are using [dqbd/tiktoken](https://github.com/dqbd/tiktoken) but the wasm bundle is broken at cloudflare worker. But then I discovered that we can utilize langchain.js get the token size. (They are using the pure js version of dqbd/tiktoken called "js-tiktoken" under the hood). You could find the explanation of the author here [^2]
- You could use `StructuredOutputParser.fromZodSchema()` to generate schema parser for the prompt. This is very useful to indicate model that it should give back a valid json object. We are also using the same schema to validate the tRPC response.

## Future plan

- We are planning to expand the functionality of this project into several direction
  - Chain different provider like Slack, Linear, Asena to help people priortize their task
- Add functionality to spilt the frog into different tasks.
- Calculate the time needed to finish the task and help people to plan their day.

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
</details>

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


[^1]: [Todoist/Eat the frog](https://todoist.com/productivity-methods/eat-the-frog)
[^2]: [Cloudflare worker Uncaught ReferenceError: FinalizationRegistry is not defined](https://github.com/dqbd/tiktoken/issues/46)