/* eslint-disable react/prop-types */
import React from 'react';
import './prodStyles.css';
import ImageGallery from './ImageGallery.jsx';
import StyleSelector from './StyleSelector.jsx';
import DropDownsAndButtons from './DropDownsAndButtons.jsx';
import SloganDescription from './SloganDescription.jsx';


function ProductOverview ({productList, currentProductID, currentStyleID, changeCurrentStyle}) {
  return (
    <div>

      <div className="d-flex flex-row" >
        <div className="flex-column-8" style={{width: '50em', margin: '1em', position: 'relative'}}>
          <h3>PRODUCT OVERVIEW</h3>
          <ImageGallery
            styles={productList.productStyles}
            currentProductID={currentProductID}
            currentStyleID={currentStyleID}/>

        </div>

        <div className="d-flex flex-column" style={{width: '20em', margin: '1em', position: 'relative'}}>
          <StyleSelector
            styles={productList.productStyles}
            currentStyleID={currentStyleID}
            currentProductID={currentProductID}
            changeCurrentStyle={changeCurrentStyle}/>
          <DropDownsAndButtons
            productStyles={productList.productStyles}
            currentStyleID={currentStyleID}
            currentProductID={currentProductID}/>

        </div>
      </div>


      <div className="d-flex flex-row" style={{width: '50em', margin: '1em', position: 'relative'}}>
        <div>
          <SloganDescription
            productList={productList}/>
        </div>
      </div>


    </div>
  );
}

export default ProductOverview;


