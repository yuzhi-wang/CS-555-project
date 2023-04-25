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
    position: "absolute",
    marginLeft:70,
    marginTop:13,
    padding: 10,
    width: 70,
    height: 70
  },
  title: {
    width: 300,
    fontSize: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#112131',
    borderBottomStyle: 'solid',
    marginLeft:15,
    marginBottom: 20,
    fontFamily: "Times-Roman",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
    marginBottom: 20,
    
  },
  signature: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman"
  },
  container:{
    flexDirection: 'row',
  },
  sigcontainer:{

  },
  image: {
    maxHeight:100,
    maxWidth: 200,
    marginVertical: 10,
    marginHorizontal: 50
  },
  header: {
    fontSize: 24,
    marginBottom: 39,
    textAlign: "center",
    fontFamily: "Times-Roman",
  },
  subtitle: {
    fontSize: 15,
    color: "black",
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
});

const ContractGenerator = ({data}) => {
    // console.log(data)
  return (
    <Document>
      <Page style={styles.body}>
        <Image style={styles.logo} src={Logo_transparent} />

        <Text style={styles.header} fixed>SoulMate Project Contract</Text>

        <Text style={styles.title}>Customer Name (the "Buyer"): {data.customerName}</Text>
        <Text style={styles.title}>Company Name (the "Seller"): Solmate Company</Text>
        <Text style={styles.text}>
          In accordance with this Contract's terms and conditions, the Seller
          will sell a set of residential solar system to the Buyer.
        </Text>
        <Text style={styles.title}>Product Specification: {data.projectsize}W</Text>
        <Text style={styles.title}>Price: ${data.Quote} (exclude tax)</Text>
        <Text style={styles.text}>
          All payments must be received by the scheduled installation on
          {data.date}. After receiving full payment, the Seller will issue the
          invoice to the Buyer.
          The Seller should be obliged to finish the Product's construction and
          installation at Buyer's location at: {data.address}.
          The warranty period is 3 years from the installation date, {data.date}.
          During the warranty period, the Seller shall provide full maintenance
          service to the Buyer with no charge. After the warranty period, the
          Buyer has to pay for any request of maintenance related to the service. 
        </Text>
        <Text style={styles.text}>
          Signature:
        </Text>
        <View style={styles.container}> 
        <View style={styles.sigcontainer}> 
          <Text style={styles.signature}>Sale Manager:</Text>
          <Image style={styles.image} src={data.salesSignature} />
        </View>

        <View style={styles.sigcontainer}> 
          <Text style={styles.signature}>Customer:</Text>
          <Image style={styles.image} src={data.CustomerSignature} />
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

export default ContractGenerator;