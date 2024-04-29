# Created by: Dmitry Romanov, 2024
# This file is part of Firebird Event Display and is licensed under the LGPLv3.
# See the LICENSE file in the project root for full license information.

import click
from rich import inspect
import fnmatch


from pyrobird.cern_root import ensure_pyroot_importable


@click.group()
@click.pass_context
def geo(ctx):
    """
    Operations with database (create tables, erase everything, etc)
    """

    # assert isinstance(ctx, click.Context)
    # context = ctx.obj
    # assert isinstance(context, CasdmAppContext)
    # if not context.connection_str:
    #     ctx.fail("ERROR(!) Connection string is not set. Needs it to connect to BD")
    #     # click.echo(, err=True)
    #     # click.echo(ctx.get_help())

    if ctx.invoked_subcommand is None:
        print("No command was specified")


def _print_full_path(tnode):
    pass


def _remove_node(node):
    mother_volume = node.GetMotherVolume()
    mother_volume.RemoveNode(node)
    del node
    #inspect(, methods=True)



@click.command()
@click.argument('file_name', type=click.Path(exists=True))
@click.pass_context
def info(ctx, file_name):
    """
    Shows information about geometry in file,
    Requires CERN ROOT geometry file name
    """
    context = ctx.obj
    print(f"Geometry info for: '{file_name}'")

    ensure_pyroot_importable()
    import ROOT

    # TGeoManager::Import("rootgeom.root");
    #
    # TGeoIterator iter(gGeoManager->GetMasterVolume());
    #
    # TGeoNode *node;
    #
    # while ((node = iter.Next())) {
    # // printf("Name %s\n", node->GetName());
    # node->GetVolume()->ResetAttBit(TGeoAtt::kVisOnScreen);
    # }
    #
    # gGeoManager->Export("rootgeom2.root");

    import ROOT
    from ROOT import TGeoManager, TGeoIterator, TGeoAtt, TString

    #ROOT.gErrorIgnoreLevel = ROOT.kFatal

    gGeoManager = TGeoManager.Import(file_name)

    iter = TGeoIterator(gGeoManager.GetMasterVolume())

    node = iter.Next()
    while node != None:

        full_path = TString()
        iter.GetPath(full_path)
        full_path = str(full_path)
        # break
        print(full_path.count('/'), full_path)
        pattern = '*/DIRC*/DIRCModule_0*'
        if fnmatch.fnmatch(full_path, pattern):
            _remove_node(node)
            print(full_path)
            #break


        # inspect(iter, methods=True)
        #break
        # node.GetVolume().ResetAttBit(TGeoAtt.kVisOnScreen)

        node = iter.Next()

    gGeoManager.CleanGarbage()
    gGeoManager.CloseGeometry()
    output_file_name = file_name[:-4] + "new.root"
    print(f"Output file name: {output_file_name}")
    gGeoManager.Export(output_file_name)

    #
    # print("ROOT imported")
    # root_file = ROOT.TFile(file_name)
    # root_file.ls()
    # geometries = {}
    # for key in root_file.GetListOfKeys():
    #     obj_class_name = key.GetClassName()
    #     name = key.GetName()
    #     if obj_class_name in ["TGeoManager"]:
    #
    #         geometries[str(key.GetName())] = root_file.Get(name)
    #
    # inspect(geometries)

    # with TFile.Open("pyroot005_file_1.root", "recreate") as f:
    #     histo_2 = ROOT.TH1F("histo_2", "histo_2", 10, 0, 10)
    #     # Inside the context, the current directory is the open file
    #     print("Current directory: '{}'.\n".format(ROOT.gDirectory.GetName()))
    #     # And the created histogram is automatically attached to the file
    #     print("Histogram '{}' is attached to: '{}'.\n".format(histo_2.GetName(), histo_2.GetDirectory().GetName()))
    #     # Before exiting the context, objects can be written to the file
    #     f.WriteObject(histo_2, "my_histogram")
    #
    # # When the TFile.Close method is called, the current directory is automatically
    # # set again to ROOT.gROOT. Objects that were attached to the file inside the
    # # context are automatically deleted and made 'None' when the file is closed.
    # print("Status after the first TFile context manager:")
    # print(" Current directory: '{}'.".format(ROOT.gDirectory.GetName()))
    # print(" Accessing 'histo_2' gives: '{}'.\n".format(histo_2))


        # #inspect(key, methods=True)
        # class_info = ROOT.gROOT.GetClass(key.GetClassName())
        #
        # print(class_info)
        # print(key.GetClassName())




    #inspect(root_file, methods=True)
    #geo_man = root_file.Get("Default")
    #inspect(my_list, methods=True)




geo.add_command(info)
