import { questionaireGenerator } from "./prompts";
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import * as dotenv from "dotenv";

dotenv.config();

export const generateSurvey = async (userQuery: string): Promise<any> => {
	try {
		/**
		 * The OpenAI model variable is imported from langchain for text completion purposes.
		 *
		 * `model` - is an instance of OpenAI model class and we need to pass in open ai API key
		 */
		const model = new OpenAI({
			openAIApiKey: process.env.OPENAI_API_KEY,
		});

		/**
		 * Prompt - Text inputs to the LLMs to do a specific task.
		 *
		 * In this example we've template strings as this allows us to pass in multi line text.
		 *
		 * PromptTemplate is a class which helps us to deal with prompts and pass variables inside to the prompts
		 * This can also help us in formatting the output response of the LLM
		 *
		 * `questionaireGenerator` - prompt used for generating survey question
		 */
		const prompt = new PromptTemplate({
			template: questionaireGenerator,
			inputVariables: ["userQuery"],
		});

		/**
		 * `chain` - it allows us to combine multiple different components together like combining multiple chains to achieve one bigger task
		 *
		 * `verbose` - logs out each step of the chain of what it is doing under the hood
		 */
		const chain = new LLMChain({
			llm: model,
			prompt,
			verbose: true,
		});

		// `call` - method present on chain object to call the GPT or any other LLM APIs to get the output of the LLM
		const result = await chain.call({
			userQuery,
		});

		console.log({ result });

		return result.text;
	} catch (error: any) {
		console.log({ error: error.message });

		return error;
	}
};
