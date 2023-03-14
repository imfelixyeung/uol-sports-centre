"""Gets the path to other payments modules"""
import sys
import os

# get the absolute path of the directory one level above
directory = os.path.abspath(os.path.join(os.getcwd(), ""))

# add the directory to the Python module search path
sys.path.append(directory)
