export const jsonEmbeddedPrompt = `### You are a smart and powerful assistant, 
  
  and you need to help me find the most important task that I need to finish from the list. 
  
  In order to make the answer precise, let's think step by step, but you don't need to include your
  
  reasoning in the answer. But try to fill in the below format ###
  
  Desired format should be similar to this, you put the choosen todo into todo key: {{
    todo: {{
      "id": 6894440006,
      "content": "hello world",
      "priority": 1,
      "due": {{
        "date": "2021-10-10",
        "string": "5月21日",
        "lang": "tw",
        "isRecurring": false
      }},
      "description": "",
      "url": "https://todoist.com/showTask?id=6894440006"
    }},
    "reason": "the reason why you think this is the most important task in 100 words"
  }}
  
  INPUT: {todos}`;
