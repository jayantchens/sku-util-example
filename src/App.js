import React, { useState, useMemo } from 'react';
import SkuUtil from 'sku-util';
import './app.css';
import { data } from './data';

function Sku () {
  const [ specList ] = useState(data.skuSpec);
  const [ specListData, setSpecListData] = useState([]); // 选中的规格属性数据对象
  useMemo(() =>  SkuUtil.initSku(data.skuList), []);

  function handleSpecAttr(item, index) {
    const list = SkuUtil.getActionSpecList(specListData, item, index);
    list && setSpecListData(list)
  }

  function checkOut() {
    const validSpecLen = specListData.filter(item => item).length;
    const specListLen = specList.length;
    if (validSpecLen < specListLen) {
      alert('请您检查是否有规格未选择')
    } else {
      alert('提交成功，请查看控制台数据')
      console.log(specListData)
    }
  }

  function transPrice() {
    const price = SkuUtil.getPrice(specListData)
    if (!price) return null;
    if (price.maxPrice === price.minPrice) {
      return `${price.maxPrice}元`;
    }
    return `${price.minPrice} ~ ${price.maxPrice}元`
  }

  function transSpec() {
    return specListData.filter(item => item).map(item => item.name).join(';')
  }

  const selectSpec = transSpec();
  const price = transPrice();
  const stock = SkuUtil.getStock(specListData);

  return (
    <div className="skuWrapper">
      {specList.map((item,index) => (
        <div className="specBox" key={item.id}>
          <div className="specName">{item.specName}</div>
          <ul>
            {item.specAttrList.map(attrItem => {
              const disabled = SkuUtil.checkSpecAttrDisabled(specListData, attrItem.id, index)
              const active = SkuUtil.checkSpecAttrActive(specListData, attrItem.id)
              return (
                <li 
                  key={attrItem.id} 
                  onClick={() => !disabled && handleSpecAttr(attrItem, index)}
                  className={
                    [
                      disabled ? 'disabled' : '',
                      active ? 'active' : ''
                    ].join('')
                }>{attrItem.name}</li>
              )
            })}
          </ul>
        </div>
      ))}
      <div className="selectedSpec" style={{marginTop: '20px'}}>选择的规格: {selectSpec || '---'}</div>
      <div className="price">价格: {price ? price : '---'}</div>
      <div className="stock">库存: {stock || stock === 0 ? stock : '---'}</div>
      <div className="checkOut" onClick={checkOut}>立即购买</div>
    </div>
  )
}

export default Sku;