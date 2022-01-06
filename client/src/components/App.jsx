import React from 'react';
import axios from 'axios';
import Reviews from './Reviews/Reviews.jsx';
import ProductOverview from './ProductDetails/ProductOverview.jsx';
import QuestionList from './QandA/QuestionList.jsx';
import RelatedItems from './RelatedItems/RelatedItems.jsx';
import NavBar from './NavBar.jsx';
import parserFunctions from '../parserFunctions.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentProductID: '',
      currentStyleID: 234004,
      productStylesArray: [],
      currentProduct: [],
      reviews: {},
      questionList: [],
      relatedItems: [],
      favoriteProducts: [],
    };
    this.favorites = {};
    this.cachedProducts = {};
    this.changeCurrentStyle = this.changeCurrentStyle.bind(this);
    this.updateReviewList = this.updateReviewList.bind(this);
    this.incrementHelpfulCount = this.incrementHelpfulCount.bind(this);
  }

  componentDidMount() {
    this.getProductData('39333');
  }

  getProductData(productId) {
    let cachedProduct = this.cachedProducts[productId];
    if (cachedProduct) {
      let {currentProduct, productStylesArray, reviews, questionList} = cachedProduct;
      parserFunctions.getRelatedItems(productId, this.cachedProducts)
        .then(relatedItems => {
          this.setState({
            currentProductID: productId,
            currentProduct,
            productStylesArray,
            reviews,
            questionList,
            relatedItems
          });
        });
    } else {
      axios.get(`./products/${productId}`)
        .then(({data}) => {
          let productInfo = {
            currentProduct: data[0],
            productStylesArray: data[1].results,
            reviews: {
              reviewsMetadata: data[4],
              reviews: data[3],
            },
            questionList: data[2]
          };
          this.cachedProducts[productId] = productInfo;
          this.getProductData(productId);
        })
        .catch(err => {
          alert(`Error encountered: ${err}`);
        });
    }
  }

  updateReviewList (reviewsList) {
    let { reviews } = this.state;
    reviews.reviews = {results: reviewsList};
    this.setState({ reviews });
  }

  incrementHelpfulCount (review_id) {
    let { reviews } = this.state;
    let idx = reviews.reviews.results.findIndex((review) =>{
      return review.review_id === review_id;
    });
    reviews.reviews.results[idx]['helpfulness'] += 1;
    this.setState({ reviews });
  }

  changeCurrentStyle(id) {
    this.setState({ currentStyleID: id });
  }

  addProductToFavorites() {
    let productToAdd = this.state.currentProductID;
    if (!this.favorites[productToAdd]) {
      this.favorites[productToAdd] = true;
      let productInfo = this.cachedProducts[productToAdd];
      let updatedFavoriteProducts = this.state.favoriteProducts.slice();
      updatedFavoriteProducts.push(productInfo);
      this.setState({
        favoriteProducts: updatedFavoriteProducts
      });
    }
  }

  removeProductFromFavorites(productId) {
    delete this.favorites[productId];
    let updatedFavoriteProducts = [];
    for (let favoriteProduct in this.favorites) {
      let productInfo = this.cachedProducts[favoriteProduct];
      updatedFavoriteProducts.push(productInfo);
    }
    this.setState({
      favoriteProducts: updatedFavoriteProducts
    });

  }

  render() {
    let { currentProduct, productStylesArray, currentStyleID } = this.state;

    if (this.state.currentProductID) {
      return (
        <div className="container">

          <NavBar />
          <ProductOverview
            currentProduct={currentProduct}
            productStylesArray={productStylesArray}
            currentStyleID={currentStyleID}
            changeCurrentStyle={this.changeCurrentStyle}
          />
          <div className="container">
            <RelatedItems relatedProductsInfo={this.state.relatedItems} currentProduct={this.state.currentProduct} favoriteProducts={this.state.favoriteProducts} addProductToFavorites={this.addProductToFavorites.bind(this)} removeProductFromFavorites={this.removeProductFromFavorites.bind(this)}/>
            <QuestionList
              data={this.state.questionList}
              currentProductID={this.state.currentProductID}
              currentProductName={this.state.currentProduct.name}/>
            <Reviews
              reviewsData={this.state.reviews}
              currentProductID={this.state.currentProductID}
              currentProductName={this.state.currentProduct.name}
              incrementHelpfulCount={this.incrementHelpfulCount}
              updateReviewList={this.updateReviewList}/>
          </div>
        </div>
      );
    } else {
      return (
        <div></div>
      );
    }
  }
}

export default App;
