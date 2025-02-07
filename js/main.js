let eventBus = new Vue()
Vue.component('product-review', {
    template: `
       <form class="review-form" @submit.prevent="onSubmit">
       <p v-if="errors.length">
             <b>Please correct the following error(s):</b>
             <ul>
               <li v-for="error in errors">{{ error }}</li>
             </ul>
       </p>
         <p>
           <label for="name">Имя:</label>
           <input id="name" v-model="name" placeholder="name">
         </p>
        
         <p>
           <label for="review"Отзыв:</label>
           <textarea id="review" v-model="review"></textarea>
         </p>
         <p>
           <label for="rating">Рейтинг:</label>
           <select id="rating" v-model.number="rating">
             <option>5</option>
             <option>4</option>
             <option>3</option>
             <option>2</option>
             <option>1</option>
           </select>
         </p>
         <p>
           <label class="rec">Смогли бы вы порекоментовать этот товар?</label>
           <input type="radio" id="rec" name="drone" value="Да" v-model="recommended">
           <label for="rec">Yes</label>
           <input type="radio" id="not_rec" name="drone" value="Нет" v-model="recommended">
           <label for="not_rec">Yesn't</label>
         </p>
         <p>
           <input type="submit" value="Submit"> 
         </p>
    
        </form>
        
        
 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
            recommended: null,
        }
    },
    methods:{
        onSubmit() {
            if(this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
        },
    }
})

Vue.component('product-details', {
    template: `
    <ul>
        <li v-for="detail in details">{{ detail }}</li>
    </ul>`,
    data() {
        return {
            details: ['80% хлопок', '20% полиэстер', 'Унисекс'],
    }}

})

Vue.component('product', {
    props: {
    premium: {
        type: Boolean,
        required: true
    }
},
template: `
<div class="product">
<div class="product-image">
       <img :src="image" :alt="altText"/>
   </div>
   <div class="product-info">
       <h1>{{ title }}</h1>
       <p>{{description}}</p>
       <span class="sale">{{ sale }}</span>
       <p v-if="inStock" >В наличии</p>
       <p v-else :class="{ OutOfStock:!inStock }">Нет в наличии</p>
       <p>Доставка: {{ shipping }}</p>
       <ul>
           <li v-for="detail in details">{{ detail }}</li>
       </ul>
       <div
               class="color-box"
               v-for="(variant, index) in variants"
               :key="variant.variantId"
               :style="{ backgroundColor:variant.variantColor }"
               @mouseover="updateProduct(index)"
       ></div>
       <select>
            <option v-for="size in sizes">{{size}}</option>
        </select>
       <button
               v-on:click="addToCart"
               :disabled="!inStock"
               :class="{ disabledButton: !inStock }"
       >
           Добавить в корзину
       </button>
       <button
               v-on:click="removeFromCart"
       >
           Удалить из корзины
       </button>
       <a v-bind:href="link">Похожее</a>    
   </div>           
   <div>
       <product-tabs :reviews="reviews"></product-tabs>
   </div>
`,
data() {
    return {
        product: "Носки",
        brand: 'Vue Mastery',
        description: "Пара теплых, пушистых носков",
        selectedVariant: 0,
        altText: "Socks",
        link: "https://www.ozon.ru/category/odezhda-obuv-i-aksessuary-7500/?text=%D0%BD%D0%BE%D1%81%D0%BA%D0%B8&clid=11468697-1",
        onSale: false,
        details: ['80% хлопок', '20% полиэстер', 'Унисекс'],
        variants: [
            {
                variantId: 2234,
                variantColor: 'green',
                variantImage: "./assets/vmSocks-green-onWhite.jpg",
                variantQuantity: 10
            },
            {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                variantQuantity: 0
            }
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        reviews: []
    }
},
mounted() {
    eventBus.$on('review-submitted', productReview => {
        this.reviews.push(productReview)
    })
},
methods: {
    addToCart() {
        this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
    },
    removeFromCart(index) {
        this.$emit('remove-from-cart',
        this.variants[this.selectedVariant].variantId);
     },
    updateProduct(index) {
        this.selectedVariant = index;
    },
    addReview(productReview) {
        this.reviews.push(productReview)
    }
},
computed: {
    title() {
        return this.brand + ' ' + this.product;
    },
    image() {
        return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
        return this.variants[this.selectedVariant].variantQuantity
    },
    sale(){
        return this.onSale ? (`${this.brand} ${this.product} Скидка!`) : (`${this.brand} ${this.product} без скидки.`);
     },
    shipping() {
        if (this.premium) {
            return "Бесплатно";
        } else {
            return "50₽"
        }
    }
}
})

Vue.component('product-tabs', {
    template: `
     <div>   
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Отзывы'">
         <p v-if="!reviews.length">Нет отзывов.</p>
         <ul>
           <li v-for="review in reviews">
           <p>{{ review.name }}</p>
           <p>Rating: {{ review.rating }}</p>
           <p>{{ review.review }}</p>
           </li>
         </ul>
       </div> 
       <div v-show="selectedTab === 'Оставить отзыв'">
         <product-review></product-review>
     </div>
     <div v-show="selectedTab === 'Доставка'">
        <product-del></product-del>
    </div>
    <div v-show="selectedTab === 'Детали'">
        <product-detail></product-detail>
    </div>
     </div>
`,
    props: {
        reviews: {
            type: Array,
            required: false
        }
    },
    data() {
        return {
            tabs: ['Отзывы', 'Оставить отзыв', 'Доставка', 'Детали'],
            selectedTab: 'Отзывы'
        }
    }
})

Vue.component('product-detail', {
    template:`
    <ul>
        <li v-for="detail in details">{{ detail }}</li>
    </ul>`,
    data () {
        return {
            details: ['80% хлопок', '20% полиэстер', 'Унисекс'],
        }
    }
})

Vue.component('product-del', {
    template:`
    <p>Доставка: {{ shipping }}</p>`,
    data () {
    },
    computed: {
        shipping() {
            if (this.premium) {
                return "Бесплатно";
            } else {
                return "50₽"
            }
        }
    }
})

    let app = new Vue({
    el: '#app',
    data: {
        premium: false,
        cart: []
    },
    methods: {
        addReview(productReview) {
            this.reviews.push(productReview)
        },
        updateCart(id) {
            this.cart.push(id);
        },
        eraseCart(id) {
            this.cart.pop(id);
        }
    },
})


