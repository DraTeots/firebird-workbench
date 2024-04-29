# Created by: Dmitry Romanov, 2024
# This file is part of Firebird Event Display and is licensed under the LGPLv3.
# See the LICENSE file in the project root for full license information.

import click

from pyrobird.__about__ import __version__
from . geo import geo as geo_group


@click.group(context_settings={"help_option_names": ["-h", "--help"]}, invoke_without_command=True)
@click.version_option(version=__version__, prog_name="fbd")
def cli_app():
    click.echo("Hello world!")


# noinspection PyTypeChecker
cli_app.add_command(geo_group)
