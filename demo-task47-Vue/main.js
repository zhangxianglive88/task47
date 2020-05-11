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

let view = new Vue({
    el: '#app',
    data:{
        book:{
            name: "未命名",
            number: 2,
            id: 1
        },
        n: 1
    },
    template: `
    <div>
        <div>
            书名：{{book.name}}
            数量：<span id="number">{{book.number}}</span>
        </div>
        <div>
            <input v-model="n">
            N的数值是{{n}}
        </div>
        <div>
            <button v-on:click="addOne">加N</button>
            <button v-on:click="minusOne">减N</button>
            <button v-on:click="reset">归零</button>
        </div>
    </div>
    `,
    created(){
        model.fetch(1).then(() => {
            this.book = model.data
        })
    },
    methods:{
        addOne: function () {
            let newNumber = this.book.number + (this.n - 0)
            model.update({ number: newNumber })
                .then(() => {
                    this.book = model.data
                })
        },
        minusOne: function () {
            let newNumber = this.book.number - (this.n - 0)
            model.update({ number: newNumber })
                .then(() => {
                    this.book = model.data
                })
        },
        reset: function () {
            model.update({ number: 0 })
                .then(() => {
                    this.book = model.data
                })
        }
    }
})

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