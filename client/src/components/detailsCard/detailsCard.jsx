import React from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col, Title, Label } from './styles';

const DetailsCard = ({ purchaseOrderNbr, purchaseOrderStatDesc, parts }) => {
  const columns = [
    {
      key: 'partDescription',
      label: '',
      flex: '0.4'
    },
    {
      key: 'brandName',
      label: 'Brand',
      flex: '0.2'
    },
    {
      key: 'partNbr',
      label: 'Part Number',
      flex: '0.2'
    },
    {
      key: 'quantity',
      label: 'Quantity',
      flex: '0.2'
    }
  ];

  return (
    <Card className="card">
      <div className="card-toolbar">
        <Title className="card-title">
          <h2>{`Purchase Order #${purchaseOrderNbr}`}</h2>
          <span>{`Status: ${purchaseOrderStatDesc.toLowerCase()}`}</span>
        </Title>
      </div>
      <div className="card-content">
        {parts.map(part => (
          <Row key={part.partNbr} className="part-details">
            {columns.map(col => (
              <Col
                key={col.key}
                flex={col.flex}
              >
                {col.label && <Label>{col.label}</Label>}
                {part[col.key]}
              </Col>
            ))}
          </Row>
        ))}
      </div>
    </Card>
  );
};

DetailsCard.propTypes = {
  purchaseOrderNbr: PropTypes.string.isRequired,
  purchaseOrderStatDesc: PropTypes.string.isRequired,
  parts: PropTypes.arrayOf(
    PropTypes.shape({
      partDescription: PropTypes.string,
      partNbr: PropTypes.string,
      brandName: PropTypes.string,
      quantity: PropTypes.number
    })
  ).isRequired
};

export default DetailsCard;
