#!/usr/bin/env python

from setuptools import setup

install_requires = [
    "spacy==3.3.1",
    "PyYAML==6.0",
]

setup(
    name="core",
    version="0.1.0",
    packages=["core.engine"],
    install_requires=install_requires,
)
