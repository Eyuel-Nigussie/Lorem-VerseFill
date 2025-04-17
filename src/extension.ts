// Removed all references to verse.ts and related commands
// Cleaned up the file to only include the AI-powered functionality

import * as vscode from 'vscode';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

async function generateAIPoweredVerseFill(wordCount: number): Promise<string> {
	try {
		const response = await axios.post('https://api.openai.com/v1/completions', {
			model: 'text-davinci-003',
			prompt: `when ever i write the word "versefill" and write number like this "versefill7". I want you to generate phrase or sentence that amounts to that number specified word total. Be exact with that number of words specified

The texts generated must be referenced from the bible. and it has to make sense despite the number of words requested. and lastly ,not that much repeated. Now let's give it a try,  versefill${wordCount}`,
			max_tokens: wordCount * 2, // Adjust token limit based on word count
			temperature: 0.7
		}, {
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			}
		});

		let text = response.data.choices[0].text.trim();
		let words = text.split(/\s+/);

		// Enforce exact word count
		if (words.length > wordCount) {
			text = words.slice(0, wordCount).join(' '); // Trim to exact word count
		} else if (words.length < wordCount) {
			// Retry logic if fewer words are generated
			const additionalWords = await generateAIPoweredVerseFill(wordCount - words.length);
			text = text + ' ' + additionalWords;
		}

		return text;
	} catch (error) {
		console.error('Error generating AI-powered text:', error);
		return 'Error generating text. Please try again.';
	}
}

export function activate(context: vscode.ExtensionContext) {
	// Monitor text changes in the editor
	const disposable = vscode.workspace.onDidChangeTextDocument(async (event) => {
		const editor = vscode.window.activeTextEditor;
		if (!editor || event.document !== editor.document) {
			return;
		}

		const text = editor.document.getText();
		const match = text.match(/versefill(\d+)/);
		if (match && match.index !== undefined) {
			const wordCount = parseInt(match[1], 10);
			if (!isNaN(wordCount) && wordCount > 0) {
				const generatedText = await generateAIPoweredVerseFill(wordCount);
				const edit = new vscode.WorkspaceEdit();
				const range = new vscode.Range(
					editor.document.positionAt(match.index),
					editor.document.positionAt(match.index + match[0].length)
				);
				edit.replace(editor.document.uri, range, generatedText);
				await vscode.workspace.applyEdit(edit);
			}
		}
	});

	context.subscriptions.push(disposable);

	let dynamicVersefillCommand = vscode.commands.registerCommand('versefill.dynamic', async (args) => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const command = args?.command || '';
			const match = command.match(/versefill(\d+)?/);
			const wordCount = match && match[1] ? parseInt(match[1], 10) : 10;

			if (!isNaN(wordCount) && wordCount > 0) {
				const text = await generateAIPoweredVerseFill(wordCount);
				editor.edit(editBuilder => {
					if (editor.selection.isEmpty) {
						editBuilder.insert(editor.selection.active, text);
					} else {
						editBuilder.replace(editor.selection, text);
					}
				});
			} else {
				vscode.window.showErrorMessage('Invalid word count specified in the command.');
			}
		}
	});

	context.subscriptions.push(dynamicVersefillCommand);
}

export function deactivate() {}
