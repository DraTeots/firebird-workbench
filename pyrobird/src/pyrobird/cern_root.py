# Created by: Dmitry Romanov at 4/27/2024
# This file is part of Firebird Event Display and is licensed under the LGPLv3.
# See the LICENSE file in the project root for full license information.

import logging

default_logger = logging.getLogger("pyrobird.cern_root")


def ensure_pyroot_importable(raises=True, logger=default_logger):
    """Ensures CERN ROOT packet is loadable as it is an OPTIONAL dependence.
    Writes human readable help about what to do. Re raises the exception
    """
    try:
        import ROOT
        return True
    except ImportError as err:
        if logger:
            logger.error(f"Module ROOT is not found. Error: {err} "
                         "To make this functionality available, "
                         "ensure running in the environment where Cern ROOT PyROOT is installed. "
                         "You should be able to run python and 'import ROOT'")
        if raises:
            raise
        else:
            return False
