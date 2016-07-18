'use strict';

// Tipos primitivos
const string = 'String';
const number = 1;
const boolean = true;
const nulo = null;
const indefinido = undefined;

console.log(typeof string);
console.log(typeof number);
console.log(typeof boolean);
console.log(typeof nulo); // Retorna object
console.log(typeof indefinido);

// Função (declaração)
// (hoisted) para o topo do contexto
sayName('José');

function sayName(name) {
    console.log(name);
}

// Função (expressão)
// sayName2('João'); Gera erro

const sayName2 = function (name) {
    console.log(name);
};

// Objeto
const obj = new Object();

// Propriedade de acesso
const obj2 = {
    _age: 19, // dado
    get age() {
        console.log(`Acessando ${this._age}`);
        return this._age;
    },
    set age(age) {
        console.log(`Alterando ${this._age} para ${age}`);
        this._age = age;
    }
};

obj2.age;
obj2.age = 10;

// Propriedade de dado
obj.name = 'um nome';
obj2['name'] = 'um outro nome';

// Método
obj2.sayHello = function() {
    console.log(`Olá, eu sou ${this.name} tenho ${this.age} anos.`);
};

obj2.sayHello();

console.log('name' in obj);
console.log(obj2.hasOwnProperty('name'));

console.log(Object.keys(obj));

for (let property in obj) {
    console.log('Name: ' + property);
    console.log('Value: ' + obj[property]);
}

delete obj.name;
delete obj2.name;

console.log(obj);
console.log(obj2);

/*
 * Todas as propriedades tem vários atributos associados.
 * Esses atributos definem o comportamento da propriedade.
 * Dado / Acesso: [[Enumerable]], [[Configurable]]
 * Dado: [[Writable]], [[Value]]
 * Acesso: [[Get]], [[Set]]
 * 
 * Esses atributos podem ser alterados por meio de Object.defineProperty() ou Object.defineProperties()
 */

console.log(Object.getOwnPropertyDescriptor(obj2, 'sayHello'));
console.log(Object.getOwnPropertyDescriptor(obj2, 'age'));

const obj3 = {};

obj3.prop = 'Zeu';
obj.prop = 'Zeu';

Object.preventExtensions(obj); // Não permite novas propriedades

// obj.teste = 'teste'; Gera erro

console.log(obj.prop);

delete obj.prop;

console.log(obj.prop);

Object.seal(obj3); // Não permite novas propriedades, e suas propriedades são não configuraveis

console.log(obj3.prop);

// delete obj3.prop; Gera erro

console.log(obj3.prop);

const obj4 = {};

obj4.name = 'Eliseu';

Object.freeze(obj4); // Não permite novas propriedades, suas propriedades são não configuraveis e não podem ser atualizadas

console.log(obj4.name);

// obj4.name = 'Zeu'; Gera erro

console.log(obj4.name);

// Construtores
const People = function(firstname, lastname, age, msg) {
    this.name = `${firstname} ${lastname}`;
    this.age = age;

    this.sayName = function() {
        console.log(this.name);
    };

    this.sayHello = function() {
        console.log(msg);
    };

    this.setMsg = function(msg2) {
        msg = msg2;
    };
};

People.prototype.sayHelloTo = function(name) {
    console.log('Oi eu sou o %s, você é o %s?', this.name, name);
};

People.prototype.isAlive = true;

People.prototype.kill = function() {
    // this.isAlive = false; isAlive é substituido na instancia
    People.prototype.isAlive = false; // Altera todas as instancias
};

const people = new People('Eliseu', 'Codinhoto', 19, 'Eae mano!');

console.log(people.name);
console.log(people.age);

console.log(people.firstame);
console.log(people.lastame);

people.sayName();
people.sayHello();

people.setMsg('Opa, eae :)');
people.sayHello();

console.log(people instanceof People);
console.log(people.constructor == People);

console.log(people.hasOwnProperty('sayHelloTo')); // false
people.sayHelloTo('Zeca');

const people2 = new People('José', 'Silva', 30, 'Suave mlk.');

console.log(people.isAlive);
console.log(people2.isAlive);

people.kill();

console.log(people.isAlive);
console.log(people2.isAlive);

const Animal = function() {};

Animal.prototype = {
    constructor: Animal, // Sempre que definir "prototype" como um novo objeto precisamos lembrar de criar o constructor para que ele não perca a referencia
    sayHello: function() {
        console.log('I don`t know how.');
    }
};

const vaca = new Animal; // Não é necessário passar parametros, então podemos ocultar os parenteses

vaca.sayHello();

const AnimalMarinho = function() {

};

AnimalMarinho.prototype = Object.create(Animal.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: AnimalMarinho,
        writable: true
    }
});

const baleia = new AnimalMarinho;

baleia.sayHello();
console.log(baleia instanceof AnimalMarinho);
console.log(baleia instanceof Animal);

const Rectangle = function(length, width) {
    this.length = length;
    this.width = width;
};

Rectangle.prototype.getArea = function() {
    return this.length * this.width;
};

Rectangle.prototype.toString = function() {
    return `[Rectangle ${this.length} x ${this.width}]`;
};

// HERANÇA PSEUDOCLÁSSICA
// Constructor stealing
const Square = function(size) {
    Rectangle.call(this, size, size); // Isso não relaciona prototype, apenas chama o constructor
};

Square.prototype = Object.create(Rectangle.prototype, {
    constructor: {
        configurable: true,
        enumerable: true,
        value: Square,
        writable: true
    } 
});

Square.prototype.toString = function() {
    const text = Rectangle.prototype.toString.call(this);
    return text.replace('Rectangle', 'Square');
};

const rec = new Rectangle(30, 60);
const sqr = new Square(50);

console.log(rec.getArea());
console.log(sqr.getArea());

console.log(`${rec}`); // Chama .toString
console.log(`${sqr}`); // Chama .toString

// PADRÃO DE MÓDULO

// IIFE (Immediately Invoked Function Expression)
const person = (function() {
    let age = 25;

    return {
        name: 'Zeu',
        // Clousure, funções que tem acesso a dados fora de seu escopo
        getAge: function() {
            return age;
        },
        growOlder: function() {
            age++;
        }
    };
})();

// Revealing Module Pattern
const person2 = (function() {
    let age = 25;

    const getAge = function() {
        return age;
    };

    const growOlder = function() {
        age++;
    };

    return {
        name: 'Zeu',
        // Clousure, funções que tem acesso a dados fora de seu escopo
        getAge,
        growOlder 
    };
})();

console.log(person.getAge());
console.log(person.age);
person.growOlder();
console.log(person.getAge());

console.log(person2.getAge());
console.log(person2.age);
person2.growOlder();
console.log(person2.getAge());

// MIXINS
function EventTarget() {}

EventTarget.prototype = {
	constructor: EventTarget,
	addListener: function (type, listener) {
        // cria um array se ele não existir
        if (!this.hasOwnProperty('_listeners')) {
            this._listeners = [];
        }

        if (typeof this._listeners[type] == 'undefined') {
            this._listeners[type] = [];
        }

        this._listeners[type].push(listener);
    },
    fire: function (event) {
        if (!event.target) {
            event.target = this;
        }

        if (!event.type) { // falsy
            throw new Error('Event object missing "type" property');
        }

        if (this._listeners && this._listeners[event.type] instanceof Array) {
            var listeners = this._listeners[event.type];

            for (let i = 0, len = listeners.length; i < len; i++) {
                listeners[i].call(this, event);
            }
        }
    },
    removeListener: function(type, listener) {
        if (this._listeners && this._listeners[type] instanceof Array) {
            var listeners = this._listeners[type];

            for (let i = 0, len = listeners.length; i < len; i++) {
                if (listeners[i] === listener) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }
};

const target = new EventTarget();

target.addListener('message', function (event) {
    console.log(event.data + ' - 1');
});

const t = function (event) {
    console.log(event.data + ' - 2');
};

target.addListener('message', t);

target.addListener('message', function (event) {
    console.log(event.data + ' - 3');
});

target.fire({type: 'message', data: 'teste'});

target.removeListener('message', t);

target.fire({type: 'message', data: 'teste'});

function mixin(receiver, supplier) {
    if (Object.getOwnPropertyDescriptor) { // Verifica suporte ao ES5
        Object.keys(supplier).forEach(function (property) { // Object.keys() retorna apenas propriedades enumeraveis caso queira também as não enumeraveis utilize Object.getOwnPropertyNames()
            let descriptor = Object.getOwnPropertyDescriptor(supplier, property);

            Object.defineProperty(receiver, property, descriptor);
        });
    } else {
        for (let property in supplier) {
            if (supplier.hasOwnProperty(property)) {
                receiver[property] = supplier[property];
            }
        }
    }

    return receiver;
}

let personMixin = mixin(new EventTarget(), {
    get name() {
        return 'Nicholas';
    },

    sayName: function() {
        console.log(this.name);

        this.fire({type: 'namesaid', name: this.name});
    }
});

console.log(personMixin);

// personMixin.name = 'Greg'; // Tenta alterar o nome que só tem a propriedade de acesso (GET) GERA ERRO

console.log(personMixin.name);

personMixin.addListener('namesaid', function (event) {
    console.log('Evento namesaid disparado por', event.name);
});

personMixin.addListener('namesaid', function (event) {
    console.log('%s disse seu nome.', event.name);
});

personMixin.sayName();

// CONSTRUTORES DE ESCOPO SEGURO
function Time(name) {
    if (this instanceof Time) {
        return this.name = name;
    } else {
        return new Time(name);
    }
}

const santos = Time('Santos');
const saopaulo = new Time('São Paulo');

console.log(santos.name);
console.log(saopaulo.name);

console.log(santos instanceof Time);
console.log(saopaulo instanceof Time);

function UmObjetoQualquer() {
    if (this instanceof UmObjetoQualquer) {
        this.name = 'UmObjetoQualquer';
        this.sayName = function() {
            console.log(this.name);
        };

        return this;
    } else {
        return new UmObjetoQualquer;
    }
}

const umObj = new UmObjetoQualquer;
const outroObj = UmObjetoQualquer();

umObj.sayName();
outroObj.sayName();

console.log(umObj instanceof UmObjetoQualquer);
console.log(outroObj instanceof UmObjetoQualquer);