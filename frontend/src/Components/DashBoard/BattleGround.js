import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation,useNavigate } from 'react-router-dom';
import { useUser, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import DOMPurify from 'dompurify';
import katex from 'katex';
import Editor from "../Question/Editor";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Discription from "../Question/Discription";
import 'katex/dist/katex.min.css';

// Function to convert LaTeX to HTML
const convertLatexToHtml = (latex) => {
  try {
    return katex.renderToString(latex.replace(/\\lt/g, '<='), { throwOnError: false });
  } catch (error) {
    console.error('Error rendering LaTeX:', error);
    return latex;
  }
};

// Function to convert LaTeX in HTML content
const convertContent = (content) => {
  // Process LaTeX content
  const processedContent = content.replace(/\$\$\$([^$]+)\$\$\$/g, (_, latex) => {
    return convertLatexToHtml(latex);
  });

  // Replace \lt with <= in HTML content
  const updatedContent = processedContent.replace(/\\lt/g, '<=');

  // Sanitize HTML content
  return DOMPurify.sanitize(updatedContent);
};

function BattleGround() {
  const location = useLocation(); // Get the current location object
  const currentPath = location.pathname; 

  const { user } = useUser(); // Access the current user
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  
  const [result, setResult] = useState(null);
  const [socket, setSocket] = useState(null);
  const [problemStatement, setProblemStatement] = useState('');
  const [inputSpecification, setInputSpecification] = useState('');
  const [outputSpecification, setOutputSpecification] = useState('');
  const [sampleInputs, setSampleInputs] = useState([]);
  const [sampleOutputs, setSampleOutputs] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080/');
      setSocket(ws);
      console.log("connected");
      ws.onmessage = (event) => {
        var dup=event.data;
        toast(dup);
      };
     
    if (user) {
      // Send Axios request with the current location and user information
      axios.post('http://localhost:8000/getCFurl', {
        email: user.emailAddresses[0]?.emailAddress,
        location: currentPath
      })
      .then(response => {
        // Handle the response if needed
        setResult(response);
        console.log('Response:', response.data.message);
        return axios.post('http://localhost:8000/getHTML', { url: response.data.message });
      })
      .then(pageResponse => {
        const { problemStatement, inputSpecification, outputSpecification, sampleInputs, sampleOutputs } = pageResponse.data;
        const decodeHtmlEntities = (str) => {
            const txt = document.createElement('textarea');
            txt.innerHTML = str;
            return txt.value;
          };
          console.log(sampleInputs)
        setProblemStatement(convertContent(decodeHtmlEntities(problemStatement) || ''));
        setInputSpecification(convertContent(decodeHtmlEntities(inputSpecification) || ''));
        setOutputSpecification(convertContent(decodeHtmlEntities(outputSpecification) || ''));
        setSampleInputs(sampleInputs[0].split('\n') || []);
        setSampleOutputs(sampleOutputs[0].split('\n') || []);
        // console.log(pageResponse.data.problemStatement);
      })
      .catch(error => {
        // Handle any errors
        console.error('Error sending request:', error);
      });
    }

    return () => {
      ws.close();
  }
  }, [user, currentPath]);

  return (
    <>
      <SignedOut>
        <RedirectToSignIn redirectUrl={currentPath} />
      </SignedOut>
      <SignedIn>
        {/* {userEmail} */}
        {/* Find the corresponding game if it exists among games array in backend */}
        {/* {result != null ? result.data.message : ''} */}
        <div dangerouslySetInnerHTML={{ __html: problemStatement }} />
        {/* <Discription question={problemStatement}></Discription> */}
        <br></br>
 
        <div dangerouslySetInnerHTML={{ __html: inputSpecification }} />
        <br></br>
 
        <div dangerouslySetInnerHTML={{ __html: outputSpecification }} />
        <br></br>
        <h2>Sample input</h2>
        <br></br>
        {sampleInputs.map((input, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: input }} />
        ))}
        <br></br>
        <h2>Sample output</h2>
        <br></br>
        {sampleOutputs.map((output, index) => (
          <div key={index} dangerouslySetInnerHTML={{ __html: output }} />
        ))}
      
      {result && <Editor solve={result.data.message}/>}
      </SignedIn>
    </>
  );
}

export default BattleGround;
