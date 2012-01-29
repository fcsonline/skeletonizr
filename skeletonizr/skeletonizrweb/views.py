from django.shortcuts import render_to_response
from django.template.loader import render_to_string
from django.http import HttpResponse

import datetime
import os, sys

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
    pathapp = path + 'app/'
    pathappmodules = pathapp + 'modules/'
    pathapptemplates = pathapp + 'templates/'

    if not os.path.exists(path):
      os.makedirs(path)

    if not os.path.exists(pathapp):
      os.makedirs(pathapp)

    if not os.path.exists(pathappmodules):
      os.makedirs(pathappmodules)

    if not os.path.exists(pathapptemplates):
      os.makedirs(pathapptemplates)

    data['project'] = project
    data['entities'] = entities

    log += 'Creating ' + project + ' files...\n'

    f = open( pathapp + 'application.js', 'w')
    f.write('# Write here yout application\n\n')
    f.close()

    log += 'Creating server files...\n'

    f = open( path + 'server.js', 'w')
    source = render_to_string('nodeexpress/' + 'server.js', data)
    f.write(source)
    f.close()

    f = open( path + 'package.json', 'w')
    source = render_to_string('nodeexpress/' + 'package.json', data)
    f.write(source)
    f.close()

    for entity in entities:
      data['entity'] = entity

      log += 'Creating ' + entity + '.js file...\n'

      f = open( pathappmodules + entity + '.js', 'w')
      source = render_to_string('generator.html', data)
      f.write(source)
      f.close()

    log += '\n'

    for entity in entities:
      data['entity'] = entity

      log += 'Creating ' + entity + '.html file...\n'

      f = open( pathapptemplates + entity + '.html', 'w')
      source = render_to_string('generator.html', data)
      f.write(source)
      f.close()

    #return HttpResponse(log, content_type='text/plain')
    #return HttpResponse(log, content_type="text/plain")
    return HttpResponse(log)

def genserver():
  return "Hola"
