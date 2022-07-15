#!/usr/bin/env python

from setuptools import setup

install_requires = [
    "spacy==3.3.1",
    # note, the #egg=en_core_web_lg at the end of the URL tells pip to not reinstall this package
    # from: https://github.com/explosion/spaCy/issues/1143
    "en-core-web-lg @ https://github.com/explosion/spacy-models/releases/download/en_core_web_lg-3.3.0/en_core_web_lg-3.3.0-py3-none-any.whl#egg=en_core_web_lg",
    "stanza==1.4.0",
    "PyYAML==6.0",
    "networkx==2.8.4",
    "beautifulsoup4==4.11.1",
]

setup(
    name="core",
    version="0.1.0",
    packages=["core.engine"],
    install_requires=install_requires,
)
