#!/usr/bin/env python

from setuptools import setup

install_requires = [
    "spacy==3.3.1",
    "en-core-web-sm @ https://github.com/explosion/spacy-models/releases/download/en_core_web_sm-3.3.0/en_core_web_sm-3.3.0-py3-none-any.whl",
    "stanza==1.4.0",
    "PyYAML==6.0",
    "networkx==2.8.4"
]

setup(
    name="core",
    version="0.1.0",
    packages=["core.engine"],
    install_requires=install_requires,
)
