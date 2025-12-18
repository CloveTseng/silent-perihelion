import shutil
import os

output_filename = 'release/SilentPerihelion-Portable'
dir_name = 'release/win-unpacked'

shutil.make_archive(output_filename, 'zip', dir_name)
print(f"Created {output_filename}.zip")
