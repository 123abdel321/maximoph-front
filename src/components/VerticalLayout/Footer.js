import React from "react"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <Col md={6}></Col>
            <Col md={6}>
              <div className="text-sm-end d-none d-sm-block">
                {new Date().getFullYear()} © Máximo PH - <a href="https://test.portafolioerp.com" target="_blank">Powered by Portafolio ERP</a>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
