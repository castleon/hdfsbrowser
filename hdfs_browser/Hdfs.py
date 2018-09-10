import os
import configparser
from pyarrow import hdfs

class Hdfs:

	def __init__():
		self.__config = configparser.ConfigParser()
        conf_path = "/etc/.config/octopus/dataprovider.ini"
        self.__config.read(conf_path)
        os.environ['JAVA_HOME'] = self.__config['hadoop']['java.home']
        os.environ['ARROW_LIBHDFS_DIR'] = self.__config['hadoop']['libhdfs.dir']
        os.environ['HADOOP_HOME'] = self.__config['hadoop']['hadoop.home']
        os.environ['HADOOP_CONF_DIR'] = self.__config['hadoop']['hadoop.conf.dir']
        os.environ['HADOOP_USER_NAME'] = self.__config['hadoop']['hadoop.user.name']
        os.environ['YARN_CONF_DIR'] = self.__config['yarn']['yarn.conf.dir']
        self.__hdfs = hdfs.connect()

	def query(self, hdfs_path):
		if self.__hdfs.exists(hdfs_path):
			print(self.__hdfs.info(hdfs_path))
			return self.__hdfs.info(hdfs_path)

		