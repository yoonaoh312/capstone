
import React from 'react';
import { Box } from '@mui/material';
import githubLogo from '../../assets/logos/GitHub.mp4';
import linkedinLogo from '../../assets/logos/LinkedIn.mp4';
import './Footer.scss';

const Footer = () => {
  return (
    <Box component="footer" className="footer">
      <a
        href="https://github.com/yoonaoh312"  
        target="_blank"
        rel="noopener noreferrer"
      >
        <video autoPlay loop muted className="github-video">
          <source src={githubLogo} type="video/mp4" />
        </video>
      </a>
      <a
        href="https://www.linkedin.com/in/yoona-1118-oh"  
        target="_blank"
        rel="noopener noreferrer"
      >
        <video autoPlay loop muted className="linkedin-video">
          <source src={linkedinLogo} type="video/mp4" />
        </video>
      </a>
    </Box>
  );
};

export default Footer;
