from django.shortcuts import render_to_response
from django.template.loader import render_to_string
from django.http import HttpResponse

import datetime
import os, sys, shutil 

def index(request):
    data = {}

    data['entities']= ['a','b','c']

    return render_to_response('index.html', data)

def gen(request):
    data = {}

    project = 'skeleton'
    entities = ['customer','employee','department']

    log = 'Skeletorizr Log\n\n'

    path = '/tmp/' + project + '/'

    if not os.path.exists(path):
      os.makedirs(path)

    data['project'] = project
    data['entities'] = entities

    log += 'Creating ' + project + ' files...\n'

    tpl_dir = './skeletonizrweb/templates/'

    for dirname, dirnames, filenames in os.walk(tpl_dir + 'nodeexpress/'):
        for subdirname in dirnames:
            src = os.path.join(dirname, subdirname)
            src_tpl = os.path.join(dirname, subdirname)[len(tpl_dir):]
            dst_tpl = os.path.join(dirname, subdirname)[len(tpl_dir) + len('nodeexpress/'):]
            dst = os.path.join(path, dst_tpl)

            log += 'Creating ' + dst + '\n'
      	    os.makedirs(dst)
        for filename in filenames:
            src = os.path.join(dirname, filename)
            src_tpl = os.path.join(dirname, filename)[len(tpl_dir):]
            dst_tpl = os.path.join(dirname, filename)[len(tpl_dir) + len('nodeexpress/'):]
            dst = os.path.join(path, dst_tpl)

	    if dst.find('__entity__') >= 0:
            	log += 'Entity in ' + dst + '\n'

	        for entity in entities:
	            data['entity'] = entity

		    dst_entity = dst.replace('__entity__', entity)

		    f = open(dst_entity, 'w')
		    source = render_to_string(src_tpl, data)
		    f.write(source)
		    f.close()
	    else:
                log += 'Generating ' + dst + '\n'

	        f = open(dst, 'w')
	        source = render_to_string(src_tpl, data)
	        f.write(source)
	        f.close()

    #return HttpResponse(log, content_type='text/plain')
    #return HttpResponse(log, content_type="text/plain")
    return HttpResponse(log)

def genserver():
  return "Hola"
