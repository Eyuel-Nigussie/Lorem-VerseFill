// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { bibleVerses } from './verses';

// Function to generate Bible-based placeholder text
function generateVerseFill(length: number = 100, includeReferences: boolean = false): string {
	let result: string[] = [];
	let currentWordCount = 0;
	
	while (currentWordCount < length) {
		const randomVerse = bibleVerses[Math.floor(Math.random() * bibleVerses.length)];
		const verseWords = randomVerse.text.split(' ');
		
		if (includeReferences) {
			result.push(`${randomVerse.text} (${randomVerse.reference})`);
		} else {
			result.push(randomVerse.text);
		}
		
		currentWordCount += verseWords.length;
	}

	return result.join(' ');
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "lorem-VerseFill" is now active!');

	// Register the command for generating short text (around 100 words)
	let shortTextCommand = vscode.commands.registerCommand('versefill.generateShort', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const config = vscode.workspace.getConfiguration('versefill');
			const includeReferences = config.get<boolean>('includeReferences', false);
			const text = generateVerseFill(100, includeReferences);
			editor.edit(editBuilder => {
				if (editor.selection.isEmpty) {
					editBuilder.insert(editor.selection.active, text);
				} else {
					editBuilder.replace(editor.selection, text);
				}
			});
		}
	});

	// Register the command for generating medium text (around 250 words)
	let mediumTextCommand = vscode.commands.registerCommand('versefill.generateMedium', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const config = vscode.workspace.getConfiguration('versefill');
			const includeReferences = config.get<boolean>('includeReferences', false);
			const text = generateVerseFill(250, includeReferences);
			editor.edit(editBuilder => {
				if (editor.selection.isEmpty) {
					editBuilder.insert(editor.selection.active, text);
				} else {
					editBuilder.replace(editor.selection, text);
				}
			});
		}
	});

	// Register the command for generating long text (around 500 words)
	let longTextCommand = vscode.commands.registerCommand('versefill.generateLong', () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const config = vscode.workspace.getConfiguration('versefill');
			const includeReferences = config.get<boolean>('includeReferences', false);
			const text = generateVerseFill(500, includeReferences);
			editor.edit(editBuilder => {
				if (editor.selection.isEmpty) {
					editBuilder.insert(editor.selection.active, text);
				} else {
					editBuilder.replace(editor.selection, text);
				}
			});
		}
	});

	// Register the command for custom length text
	let customTextCommand = vscode.commands.registerCommand('versefill.generateCustom', async () => {
		const wordCount = await vscode.window.showInputBox({
			prompt: 'Enter the number of words you want to generate',
			placeHolder: 'e.g., 200'
		});

		if (wordCount && !isNaN(Number(wordCount))) {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const config = vscode.workspace.getConfiguration('versefill');
				const includeReferences = config.get<boolean>('includeReferences', false);
				const text = generateVerseFill(Number(wordCount), includeReferences);
				editor.edit(editBuilder => {
					if (editor.selection.isEmpty) {
						editBuilder.insert(editor.selection.active, text);
					} else {
						editBuilder.replace(editor.selection, text);
					}
				});
			}
		}
	});

	// Add commands to subscriptions
	context.subscriptions.push(shortTextCommand);
	context.subscriptions.push(mediumTextCommand);
	context.subscriptions.push(longTextCommand);
	context.subscriptions.push(customTextCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
