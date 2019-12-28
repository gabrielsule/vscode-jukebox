import * as vscode from 'vscode';
const _childProc = require('child_process');
const _path = require('path');
const _ks = require('node-key-sender');
let _sbOpen: vscode.StatusBarItem;
let _sbPlay: vscode.StatusBarItem;
let _sbStop: vscode.StatusBarItem;
let _sbNext: vscode.StatusBarItem;


export function activate(context: vscode.ExtensionContext) {

	const player = new Player();

	let loadMusic = vscode.commands.registerCommand('extension.loadmusic', () => {
		player.playerLoad();
	});

	let startMusic = vscode.commands.registerCommand('extension.startmusic', () => {
		player.playerStart();
	});

	let stopMusic = vscode.commands.registerCommand('extension.stopmusic', () => {
		player.playerStop();
	});

	let nextMusic = vscode.commands.registerCommand('extension.nextmusic', () => {
		player.playerNext();
	});

	// let radioMusic = vscode.commands.registerCommand('extension.radiomusic', () => {
	// 	vscode.window.showInputBox({
	// 			placeHolder: 'Ingrese url de la estación'
	// 		})
	// 		.then((res) => {
	// 			if (res) {
	// 				player.playerRadio(res);
	// 			} else {
	// 				throw new Error();
	// 			}
	// 		});
	// });


	_sbOpen = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 4);
	_sbPlay = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 3);
	_sbStop = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 2);
	_sbNext = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1);

	context.subscriptions.push(loadMusic, startMusic, stopMusic, nextMusic);
}

class Player {
	_stealth: string = '';
	_playList: string = '';
	_hotKey: string = '';

	constructor() {
		this._stealth = _path.join(__dirname, '..', 'resources', 'sound', 'Stealth.exe');
	}

	playerLoad(): void {
		this._hotKey = '--hotkeys=extra2';

		const options: vscode.OpenDialogOptions = {
			canSelectFolders: true,
		};

		vscode.window.showOpenDialog(options).then(fileUri => {
			if (fileUri && fileUri[0]) {
				this._playList = fileUri[0].fsPath;
				_childProc.exec(`${this._stealth} ${this._hotKey} "${this._playList}"`);
			}
		});

		this.setStatusBar();
	}

	playerStart() {
		_ks.sendCombination(['control', 's']);
	}

	playerStop() {
		_ks.sendCombination(['control', 's']);
	}

	playerNext() {
		_ks.sendCombination(['control', 'f']);
	}

	// playerRadio(radio: string) {
	// 	this._hotKey = '--hotkeys-off=general';
	// 	_childProc.exec(`${this._stealth} "${radio}" ${this._hotKey}`);
	// }

	setStatusBar() {
		_sbOpen.text = '$(folder-opened)';
		_sbOpen.command = 'extension.loadmusic';
		_sbOpen.color = 'yellow';
		_sbOpen.show();

		_sbPlay.text = '$(triangle-right)';
		_sbPlay.command = 'extension.startmusic';
		_sbPlay.color = 'green';
		_sbPlay.show();

		_sbStop.text = '$(debug-pause)';
		_sbStop.command = 'extension.stopmusic';
		_sbStop.color = 'red';
		_sbStop.show();

		_sbNext.text = '$(chevron-right)';
		_sbNext.command = 'extension.nextmusic';
		_sbNext.color = 'violet';
		_sbNext.show();
	}
}



export function deactivate() {}