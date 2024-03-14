const { app, BrowserWindow, screen, ipcMain, nativeTheme } = require('electron');
const path = require('path');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// 热加载
try {
	require('electron-reloader')(module, {});
} catch (_) {}

const createWindow = () => {
	const { width, height } = screen.getPrimaryDisplay().workAreaSize;
	const win = new BrowserWindow({
		width,
		height,
		webPreferences: {
			// nodeIntegration: true,
			// contextIsolation: false,
		},
	});
	// 判断当前环境
	if (process.env.NODE_ENV === 'development') {
		// 自动打开工作台
		win.webContents.openDevTools();
		// 加载本地服务地址
		win.loadURL('http://localhost:8080'); 
		// win.loadFile('./dist/index.html');
	} else {
		// 加载打包后的静态页面
		win.loadFile('./dist/index.html');
	}
};

app.whenReady().then(() => {
	createWindow();
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
