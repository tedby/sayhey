'use strict';

function getName(name) {
  return name.username ? name.username : (name.first_name + ' ' + name.last_name || '');
}

module.exports = {
  getName: getName
};
