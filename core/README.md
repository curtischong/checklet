# Troubleshooting

### How to install Core as a package

run `pip install -e ./core` in the nautilus root directory
(after `pip install -r requirements.txt` in the backend directory)

### Pycharm doesn't recognize Core as a package name

You have to mark all the directories including and underneath the
Core module (under the root of the nautilus directory) as 'sources root'.

### Pycharm's search is showing me variables inside of virtual environments

1) Locate the virtual environment directory in the file tree.
2) Right click that directory and `Mark Directory As` -> `Excluded`