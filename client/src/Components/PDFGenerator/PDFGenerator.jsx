import React from "react";
import { Page, Text, Image, Document, StyleSheet } from "@react-pdf/renderer";
import Logo from "../../Assets/Logo.png"

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
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

const PDFGenerator = ({data}) => {
    console.log(data)
  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.header} fixed>SoulMate Project Contract</Text>
        <Image style={styles.image} src={Logo} />
        <Text style={styles.text}>
          Oh right. I forgot about the battle. Wow, you got that off the
          Internet? In my day, the Internet was only used to download
          pornography. I don't know what you did, Fry, but once again, you
          screwed up! Now all the planets are gonna start cracking wise about
          our mamas. She also liked to shut up! We'll go deliver this crate like
          professionals, and then we'll go home. In your time, yes, but nowadays
          shut up! Besides, these are adult stemcells, harvested from perfectly
          healthy adults whom I killed for their stemcells. And I'm his friend
          Jesus. Incidentally, you have a dime up your nose. Oh, you're a dollar
          naughtier than most. Bender, being God isn't easy. If you do too much,
          people get dependent on you, and if you do nothing, they lose hope.
          You have to use a light touch. Like a safecracker, or a pickpocket.
          And why did 'I' have to take a cab? Perhaps, but perhaps your
          civilization is merely the sewer of an even greater society above you!
          Why would a robot need to drink? Stop! Don't shoot fire stick in space
          canoe! Cause explosive decompression! I'm sure those windmills will
          keep them cool. No! I want to live! There are still too many things I
          don't own! Now that the, uh, garbage ball is in space, Doctor, perhaps
          you can help me with my sexual inhibitions? I feel like I was mauled
          by Jesus. Anyhoo, your net-suits will allow you to experience Fry's
          worm infested bowels as if you were actually wriggling through them.
          Bender, I didn't know you liked cooking. That's so cute. Who am I
          making this out to? Aww, it's true. I've been hiding it for so long.
        </Text>
        <Image style={styles.image} src={data.salesSignature} />
        <Text>Sale Manager</Text>
        <Image style={styles.image} src={data.CustomerSignature} />
        <Text>Customer</Text>
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

export default PDFGenerator;