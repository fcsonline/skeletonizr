from django.shortcuts import render_to_response
from django.template.loader import render_to_string
from django.http import HttpResponse
from django.utils import simplejson
from django.core.servers.basehttp import FileWrapper
from django.views.decorators.csrf import csrf_exempt
from django.utils import simplejson

import datetime
import os, sys, shutil
import zipfile

def index(request):
    data = {}

    data['entities']= ['a','b','c']

    return render_to_response('index.html', data)

@csrf_exempt
def gen(request):

    if request.method == 'OPTIONS':
        resp = HttpResponse()
        resp["Access-Control-Allow-Origin"] = "*"
        resp["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        resp["Access-Control-Allow-Headers"] = "X-Requested-With"
        return resp

    data = {}

    project = 'skeleton'
    entities = []

    # Read the definitions from the post request
    if request.method == 'POST':
        json_data = simplejson.loads(request.raw_post_data)
        for definition in json_data:
            entities.push(definition.name)

    files = []

    path = '/tmp/' + project + '/'

    shutil.rmtree(path)

    if not os.path.exists(path):
      os.makedirs(path)

    data['project'] = project
    data['entities'] = entities

    tpl_dir = './skeletonizrweb/templates/'

    for dirname, dirnames, filenames in os.walk(tpl_dir + 'nodeexpress/'):
      for subdirname in dirnames:
        src = os.path.join(dirname, subdirname)
        src_tpl = os.path.join(dirname, subdirname)[len(tpl_dir):]
        dst_tpl = os.path.join(dirname, subdirname)[len(tpl_dir) + len('nodeexpress/'):]
        dst = os.path.join(path, dst_tpl)

        os.makedirs(dst)

      for filename in filenames:
        src = os.path.join(dirname, filename)
        src_tpl = os.path.join(dirname, filename)[len(tpl_dir):]
        dst_tpl = os.path.join(dirname, filename)[len(tpl_dir) + len('nodeexpress/'):]
        dst = os.path.join(path, dst_tpl)

        if is_magic_path(dst):

          for entity in entities:
            data['entity'] = entity

            dst_entity = get_magic_path (dst, data)

            files.append (dst_entity)
            f = open(dst_entity, 'w')
            source = render_to_string(src_tpl, data)
            f.write(source)
            f.close()
        else:
          files.append (dst)
          f = open(dst, 'w')
          source = render_to_string(src_tpl, data)
          f.write(source)
          f.close()

    #return HttpResponse(log, content_type='text/plain')
    #return HttpResponse(log, content_type="text/plain")

    #return HttpResponse(log)

    filename = 'skeleton.zip'
    filepath = path + '../' + filename

    zipper(path, filepath)

    wrapper = FileWrapper(file(filepath))
    response = HttpResponse(wrapper, content_type='application/zip')
    response['Content-Disposition'] = 'attachment; filename=%s' % filename
    response['Content-Length'] = os.path.getsize(filepath)
    return response

def is_magic_path(filename):

  if filename.find('__entity__') >= 0:
    return True

  if filename.find('__Entity__') >= 0:
    return True

  return False

def get_magic_path(filename, data):
  filename = filename.replace('__entity__', data['entity'])
  filename = filename.replace('__Entity__', data['entity'].capitalize())
  return filename

def zipper(dir, zip_file):
    zip = zipfile.ZipFile(zip_file, 'w', compression=zipfile.ZIP_DEFLATED)
    root_len = len(os.path.abspath(dir))
    for root, dirs, files in os.walk(dir):
        archive_root = os.path.abspath(root)[root_len:]
        for f in files:
            fullpath = os.path.join(root, f)
            archive_name = os.path.join(archive_root, f)
            print f
            zip.write(fullpath, archive_name, zipfile.ZIP_DEFLATED)
    zip.close()
    return zip_file
