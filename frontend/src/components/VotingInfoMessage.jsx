import { Vote, Clock, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

const VotingInfoMessage = ({ year }) => {
  const calculateAge = (year) => {
    const currentYear = new Date().getFullYear();
    return currentYear - year;
  };

  const age = calculateAge(year);

  if (age < 15 || age > 22) return null;

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const getMessage = () => {
    if (age >= 18 && age <= 22) {
      return {
        icon: <Vote className="w-6 h-6 text-primary" />,
        message:
          "Hey, you’re eligible to vote! Make sure you’re registered so you can actively participate in India's democracy.",
        link: "https://voters.eci.gov.in/",
        linkText: "Register as Voter",
      };
    } else {
      const yearsLeft = 18 - age;
      return {
        icon: <Clock className="w-6 h-6 text-secondary" />,
        message: `In ${yearsLeft} year${
          yearsLeft > 1 ? "s" : ""
        }, you'll be eligible to vote. Start learning about the process now!`,
        link: "https://ecisveep.nic.in/",
        linkText: "Learn More",
      };
    }
  };

  const messageData = getMessage();

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      className="w-full mx-auto px-4 sm:px-6 lg:px-8 mt-10"
    >
      <div className="bg-background-card border border-secondary/20 rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            {messageData.icon}
            <p className="text-text-primary font-body text-sm sm:text-base">
              {messageData.message}
            </p>
          </div>

          <a
            href={messageData.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark 
                     transition-colors rounded-full text-text-primary text-sm whitespace-nowrap"
          >
            {messageData.linkText}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default VotingInfoMessage;
