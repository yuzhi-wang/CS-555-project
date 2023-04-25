import React from "react";
import { Page, View, Text, Image, Document, StyleSheet } from "@react-pdf/renderer";
import Logo_transparent from "../../Assets/Logo_transparent.png"

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  logo: {
    // position: "absolute",
    // marginLeft:70,
    // marginTop:13,
    padding: 10,
    width: 70,
    height: 70
  },
  title: {
    width: 300,
    fontSize: 12,
    borderBottomWidth: 5,
    borderBottomColor: '#112131',
    borderBottomStyle: 'solid',
    marginLeft:15,
    fontFamily: "Times-Roman",
  },
  text: {
    margin: 6,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",    
  },
  signature: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman"
  },
  totalcontainer:{
    flexDirection: 'row',
    justifyContent: "space-between",
  },
  containerSign:{
    flexDirection: 'row',
  },
  sigcontainer:{

  },
  container:{
    flexDirection: 'row',
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: '#112131',
    borderBottomStyle: 'solid',
  },
  companycontainer:{
    flexDirection: 'row',
  },
  company:{
    fontSize: 18,
    marginTop:23,
    fontFamily: "Times-Roman",
  },
  image: {
    maxHeight:100,
    maxWidth: 200,
    marginVertical: 10,
    marginHorizontal: 50
  },
  header: {
    fontSize: 24,
    // textAlign: "center",
    borderBottom:10,
    fontFamily: "Times-Roman",
    borderBottomWidth: 5,
    borderBottomColor: '#112131',
    borderBottomStyle: 'solid',
    padding:15
  },
  total: {
    marginTop:10,
    fontSize: 16,
    fontWeight:12,
    margin: 6,
    textAlign: "justify",
    fontFamily: "Times-Roman",    
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  lineheight:{
    lineHeight: 10
  },
});

const InvoiceGenerator = ({data}) => {
    // console.log(data)
    const taxRate = 0.05;
    var tax = data.Quote * taxRate;
    var totalPrice = parseInt(data.Quote) + parseInt(tax);
  return (
    <Document>
      <Page style={styles.body}>
        <View style={styles.companycontainer}>
          <Image style={styles.logo} src={Logo_transparent} />
          <Text style={styles.company}>Solmate Company</Text>
        </View>
        <Text style={styles.header} fixed>Invoice</Text>
        <View style={styles.container}>
          <Text style={styles.text}>Product</Text>
          <Text style={styles.text}>Price ($)</Text>
        </View>

        <View style={styles.container}>
          <Text style={styles.text}>Solar System (Spec:{data.projectsize}W)</Text>
          <Text style={styles.text}>{data.Quote}</Text>
        </View>

        <View style={styles.container}>
          <Text style={styles.text}>tax</Text>
          <Text style={styles.text}>{tax}</Text>
        </View>

        <View style={styles.totalcontainer}>
          <Text style={styles.total}>Total</Text>
          <Text style={styles.total}>{totalPrice}</Text>
        </View>
        <Text style={styles.lineheight}>{"      "}</Text>
        <View style={styles.containerSign}> 
        <View style={styles.sigcontainer}> 
          <Text style={styles.signature}>Sale Manager:</Text>
          <Image style={styles.image} src={data.salesSignature} />
        </View>

        <View style={styles.sigcontainer}> 
          <Text style={styles.signature}>Resource Manager:</Text>
          <Image style={styles.image} src={data.managersignatureaftercomplete} />
        </View>
        </View>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
};

export default InvoiceGenerator;