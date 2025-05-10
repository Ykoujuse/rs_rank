fx_version 'cerulean'
game 'gta5'
author "Rsheng-QQ:3391407547"
lua54 'yes'

ui_page 'html/index.html'

shared_scripts {
  'config.lua'
}

client_scripts {
  'client/main.lua',
}

server_scripts {
  '@oxmysql/lib/MySQL.lua',
  'server/main.lua',
}

files {
  'html/index.html',
  'html/style.css',
  'html/script.js',
  'html/fonts/*.ttf',
}

dependencies {
  'oxmysql'
}
