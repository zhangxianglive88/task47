
fakeData()

function Model(options) {
    this.data = options.data
    this.resource = options.resource
}

Model.prototype.fetch = function (id) {
    return axios.get(`/${this.resource}/${id}`).then((response) => {
        this.data = response.data
        return response
    })
}

Model.prototype.update = function (data) {
    let id = this.data.id
    return axios.put(`/${this.resource}/${id}`, data).then((response) => {
        this.data = response.data
        return response
    })
}

let model = new Model({
    data: {
        name: '',
        number: 0,
        id: ''
    },
    resource: 'book'
})

function View({el, template}) {
    this.el = el
    this.template = template
}

View.prototype.render = function (data) {
    console.log(data)
    let html = this.template
    for (let key in data) {
        if(key !== 'id'){
            html = html.replace(`__${key}__`, data[key])
        }
    }
    $(this.el).html(html)
}


let view = new View({
    el: '#app',
    template: `
    <div>
        书名：__name__
        数量：<span id="number">__number__</span>
    </div>
    <div>
        <button id="addOne">加1</button>
        <button id="minusOne">减1</button>
        <button id="reset">归零</button>
    </div>
    `
})

let controller = {
    init: function (options) {
        let view = options.view
        let model = options.model
        this.view = view
        this.model = model
        this.view.render(this.model.data)
        this.bindEvents()
        this.model.fetch(1).then(() => {
            this.view.render(this.model.data)
        })
    },
    addOne: function () {
        let oldNumber = $('#number').text()
        let newNumber = oldNumber - 0 + 1
        this.model.update({ number: newNumber })
            .then(() => {
                this.view.render(this.model.data)
            })
    },
    minus: function () {
        let oldNumber = $('#number').text()
        let newNumber = oldNumber - 0 - 1
        this.model.update({ number: newNumber })
            .then(() => {
                this.view.render(this.model.data)
            })
    },
    reset: function () {
        this.model.update({ number: 0 })
            .then(() => {
                this.view.render(this.model.data)
            })
    },
    bindEvents: function () {
        $(this.view.el).on('click', '#addOne', this.addOne.bind(this))
        $(this.view.el).on('click', '#minusOne', this.minus.bind(this))
        $(this.view.el).on('click', '#reset', this.reset.bind(this))
    }
}

controller.init({ view, model })




// 伪造数据
function fakeData() {
    let book = {
        'name': 'javascript高级程序设计',
        'number': 2,
        'id': 1
    }
    // 对服务器返回数据之后的response做处理，之后再返回给客户端
    axios.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        let response = error.response;
        let { config: { method, url, data } } = response
        if (method === 'get' && url === "/book/1") {
            response.data = book
        } else if (method === "put" && url === '/book/1') {
            Object.assign(book, JSON.parse(data))
            response.data = book
        }
        return response;
    });
}