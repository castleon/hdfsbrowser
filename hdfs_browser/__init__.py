"""
Initialize the backend server extension
"""
from hdfs_browser.handlers import setup_handlers
from hdfs_browser.hdfs import Hdfs


def _jupyter_server_extension_paths():
    """
    Declare the Jupyter server extension paths.
    """
    return [{"module": "hdfs_browser"}]


def _jupyter_nbextension_paths():
    """
    Declare the Jupyter notebook extension paths.
    """
    return [{"section": "notebook", "dest": "hdfs_browser"}]

def load_jupyter_server_extension(app):
	"""
    Load the Jupyter server extension.
	"""
	hdfs = Hdfs()
	app.web_app.setting['hdfs'] = hdfs
	setup_handlers(app.web_app)