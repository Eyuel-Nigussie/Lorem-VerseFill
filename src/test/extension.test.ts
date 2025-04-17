import * as assert from 'assert';
import * as vscode from 'vscode';

describe('Extension Test Suite', () => {
	it('should register the dynamic versefill command', async () => {
		const command = vscode.commands.getCommands(true);
		assert.ok((await command).includes('versefill.dynamic'));
	});

	// Additional tests for AI-powered functionality can be added here
});
