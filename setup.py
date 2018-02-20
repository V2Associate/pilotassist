#!/usr/bin/env python
# -*- coding: utf-8 -*-


import io
import os
from setuptools import find_packages, setup

# Package meta-data.
NAME = 'pilotassist'
DESCRIPTION = 'Assistant for pilots.'
URL = 'https://github.com/V2Associate/pilotassist'
EMAIL = 'veechand@gmail.com'
AUTHOR = 'Veerabahu Subramanian C'

# What packages are required for this module to be executed?
REQUIRED = [
    # 'requests', 'maya', 'records',
]

# Where the magic happens:
setup(
    name=NAME,
    version="0.1",
    description=DESCRIPTION,
    long_description="An assistant for pilots",
    author=AUTHOR,
    author_email=EMAIL,
    url=URL,
    packages=find_packages(exclude=('tests',)),
    # If your package is a single module, use this instead of 'packages':
    # py_modules=['mypackage'],

    # entry_points={
    #     'console_scripts': ['mycli=mymodule:cli'],
    # },
    install_requires=REQUIRED,
    include_package_data=True,
    license='MIT',
    # $ setup.py publish support.
    cmdclass={
    },
)
