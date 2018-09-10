"""
Module with hdfs handlers, which execute hdfs query command and return the results to the frontend.
"""

import json

from notebook.utils import url_path_join as ujoin
from notebook.base.handlers import APIHandler

class HdfsHandler(APIHandler):
	@property
    def hdfs(self):
        return self.settings["hdfs"]

class HdfsQueryHandler(HdfsHandler):
	"""
	Handler for querying HDFS
	"""

	def post(self):
		data = json.loads(self.request.body.decode("utf-8"))
		hdfs_path = data["hdfs_path"]
		result = self.hdfs.query(hdfs_path)
		self.finish(json.dumps(result))

def setup_handlers(web_app):
    """
    Setups all of the git command handlers.
    Every handler is defined here, to be used in git.py file.
    """

    git_handlers = [
        ("/hdfs_browser", HdfsQueryHandler),
    ]

    # add the baseurl to our paths
    base_url = web_app.settings["base_url"]
    git_handlers = [(ujoin(base_url, x[0]), x[1]) for x in git_handlers]
    print("base_url: {}".format(base_url))
    print(git_handlers)

    web_app.add_handlers(".*", git_handlers)