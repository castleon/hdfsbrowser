import {
  	JupyterLab, JupyterLabPlugin, ILayoutRestorer
} from '@jupyterlab/application';

import {
  	ICommandPalette, InstanceTracker
} from '@jupyterlab/apputils';

import {
  	JSONExt 
} from '@phosphor/coreutils';

import {
  	Widget
} from '@phosphor/widgets';

import { 
	ServerConnection
} from '@jupyterlab/services';

import {
	URLExt
} from '@jupyterlab/coreutils';

import '../style/index.css';


/**
 * An HDFS file browser
 */
class HDFSWidget extends Widget {
  /**
   * Construct a new xkcd widget.
   */
  constructor() {
    super();

    this.id = 'hdfsbrowser-jupyterlab';
    this.title.label = 'HDFS Browser';
    this.title.closable = true;
    this.addClass('hdfsbrowser_widget');

    let span = document.createElement('span');
    span.className = "hdfsbrowser_span"
    span.style.fontSize = '200%';
    span.appendChild(document.createTextNode('Browse Directory'));
    this.node.appendChild(span);

    // create an input
	let ipt = document.createElement('input');
	ipt.id = "hdfs_path_input"
	ipt.className = "hdfsbrowser_input";
	
	// create a button
	let btn = document.createElement('button');
	//btn.value = "查询"
	btn.className = "hdfsbrowser_button";
	btn.addEventListener('click', display_hdfs)
	
	// create a div to place input and button
	let div = document.createElement('div');
	div.className = "hdfsbrowser_div";
	
	div.appendChild(ipt);
	div.appendChild(btn);
	this.node.appendChild(div);
  }
};

async function display_hdfs() {
	let hdfs_path = (document.getElementById("hdfsbrowser_input") as HTMLInputElement).value

	let response = await hdfs_query('/hdfs_browser', 'POST', {
        current_path: hdfs_path
    });

    alert(response.json());
}

/** Makes a HTTP request, sending a query command to the backend */
function hdfs_query(url: string, method: string, request: Object): Promise<Response> {
	
  	let fullRequest = {
    	method: method,
    	body: JSON.stringify(request)
  	};

  	let setting = ServerConnection.makeSettings();
  	let fullUrl = URLExt.join(setting.baseUrl, url);
  	return ServerConnection.makeRequest(fullUrl, fullRequest, setting);
}

function activate(app: JupyterLab, palette: ICommandPalette, restorer: ILayoutRestorer) {
  	console.log('JupyterLab extension jupyterlab_xkcd is activated!');

  	// Declare a widget variable
  	let widget: HDFSWidget;

  	// Add an application command
  	const command: string = 'hdfsbrowser:open';
  	app.commands.addCommand(command, {
    	label: 'HDFS Browser',
    	execute: () => {
	      	if (!widget) {
	        	// Create a new widget if one does not exist
	        	widget = new HDFSWidget();
	        	widget.update();
	      	}
	      	if (!tracker.has(widget)) {
	        	// Track the state of the widget for later restoration
	        	tracker.add(widget);
	      	}
	      	if (!widget.isAttached) {
	        	// Attach the widget to the main work area if it's not there
	        	app.shell.addToMainArea(widget);
	      	} else {
	        	// Refresh the comic in the widget
	        	widget.update();
	      	}
	      	// Activate the widget
	      	app.shell.activateById(widget.id);
   		}
  	});

  	// Add the command to the palette.
  	palette.addItem({ command, category: 'BigData' });

  	// Track and restore the widget state
  	let tracker = new InstanceTracker<Widget>({ namespace: 'hdfsbrowser' });
  	restorer.restore(tracker, {
    	command,
    	args: () => JSONExt.emptyObject,
    	name: () => 'hdfsbrowser'
  	});
};

/**
 * Initialization data for the jupyterlab_hdfs_browser extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: 'hdfsbrowser',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: activate
};

export default extension;
