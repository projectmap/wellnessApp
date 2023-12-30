import Link from 'next/link';
import { Box } from '@mui/system';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Container, Typography } from '@mui/material';

import { Logo } from '~/icons';

const TermsAndConditions: NextPage = () => {
  const router = useRouter();

  return (
    <Box sx={{ background: '#E4E8F1', height: '100%' }}>
      <Container maxWidth="xl" sx={{ paddingY: 4 }}>
        <Link href="/landing-page">
          <a>
            <Logo />
          </a>
        </Link>
      </Container>
      <Container maxWidth="xl" sx={{ pt: 5 }}>
        <Typography variant="h3" sx={{ mb: 4 }}>
          Terms & Conditions
        </Typography>
        <Typography variant="h4" sx={{ pb: 3, color: '#5A5A72' }}>
          Introduction
        </Typography>
        <Typography variant="body1" sx={{ pb: 3, color: '#5A5A72' }}>
          These terms and conditions (the &quot;Terms and Conditions&quot;) govern the use of{' '}
          <a href={'https://www.newstart.com/online/'}>https://www.newstart.com/online/ </a>
          (the &quot;Site&quot;). This Site is owned and operated by NEWSTART Online. This Site is a health education
          site. By using this Site, you indicate that you have read and understand these Terms and Conditions and agree
          to abide by them at all times.
        </Typography>
        <Typography variant="h4" sx={{ pb: 3, color: '#5A5A72' }}>
          Intellectual Property Rights
        </Typography>
        <Typography variant="body1" sx={{ pb: 3 }}>
          All content published and made available on our Site is the property of NEWSTART Online and the Site&apos;s
          creators. This includes, but is not limited to images, text, logos, documents, downloadable files and anything
          that contributes to the composition of our Site.
        </Typography>
        <Typography variant="h4" sx={{ pb: 3, color: '#5A5A72' }}>
          Age Restrictions
        </Typography>
        <Typography variant="body1" sx={{ pb: 3 }}>
          The minimum age to use our Site is 13 years old. By using this Site, users agree that they are over 13 years
          old. We do not assume any legal responsibility for false statements about age.
        </Typography>
        <Typography variant="h4" sx={{ pb: 3, color: '#5A5A72' }}>
          Acceptable Use
        </Typography>
        <Typography variant="body1" sx={{ pb: 3 }}>
          As a user of our Site, you agree to use our Site legally, not to use our Site for illegal purposes, and not
          to:
          <ul style={{ listStyleType: 'circle' }}>
            <li>Harass or mistreat other users of our Site;</li>
            <li>Violate the rights of other users of our Site;</li>
            <li>Violate the intellectual property rights of the Site owners or any third party to the Site;</li>
            <li>Hack into the account of another user of the Site;</li>
            <li>Act in any way that could be considered fraudulent; or</li>
            <li>Post any material that may be deemed inappropriate or offensive.</li>
          </ul>
          If we believe you are using our Site illegally or in a manner that violates these Terms and Conditions, we
          reserve the right to limit, suspend or terminate your access to our Site. We also reserve the right to take
          any legal steps necessary to prevent you from accessing our Site.
        </Typography>
        <Typography>User Contributions</Typography>
        <Typography sx={{ pb: 3 }}>
          Users may post the following information on our Site:
          <ul style={{ listStyleType: 'circle' }}>
            <li>Photos;</li>
            <li>Videos; and</li>
            <li>Public comments.</li>
            By posting publicly on our Site, you agree not to act illegally or violate these Terms and Conditions.
          </ul>
        </Typography>
        <Typography variant="h4" sx={{ pb: 3 }}>
          Accounts
        </Typography>
        <Typography variant="body1" sx={{ pb: 3, color: '#5A5A72' }}>
          When you create an account on our Site, you agree to the following:
          <ul style={{ listStyleType: 'circle' }}>
            <li>
              You are solely responsible for your account and the security and privacy of your account, including
              passwords or sensitive information attached to that account; and
            </li>
            <li>
              All personal information you provide to us through your account is up to date, accurate, and truthful and
              that you will update your personal information if it changes.
            </li>
            We reserve the right to suspend or terminate your account if you are using our Site illegally or if you
            violate these Terms and Conditions.
          </ul>
        </Typography>
        <Typography variant="h4">Sale of Services</Typography>
        <Typography variant="body1" sx={{ pb: 3 }}>
          These Terms and Conditions govern the sale of services available on our Site. The following services are
          available on our Site:  Health education. The services will be paid for in full when the services are
          ordered. These Terms and Conditions apply to all the services that are displayed on our Site at the time you
          access it. All information, descriptions, or images that we provide about our services are as accurate as
          possible. However, we are not legally bound by such information, descriptions, or images as we cannot
          guarantee the accuracy of all services we provide. You agree to purchase services from our Site at your own
          risk. We reserve the right to modify, reject or cancel your order whenever it becomes necessary. If we cancel
          your order and have already processed your payment, we will give you a refund equal to the amount you paid.
          You agree that it is your responsibility to monitor your payment instrument to verify receipt of any refund.
        </Typography>
        <Typography variant="h4" sx={{ pb: 3, color: '#5A5A72' }}>
          User Goods and Services
        </Typography>
        <Typography variant="body1" sx={{ pb: 3 }}>
          Our Site allows users to sell goods and services. We do not assume any responsibility for the goods and
          services users sell on our Site. We cannot guarantee the quality or accuracy of any goods and services sold by
          users on our Site. However, if we are made aware that a user is violating these Terms and Conditions, we
          reserve the right to suspend or prohibit the user from selling goods and services on our Site.
        </Typography>
        <Typography variant="h4" sx={{ pb: 3, color: '#5A5A72' }}>
          Subscriptions
        </Typography>
        <Typography variant="body1" sx={{ pb: 3 }}>
          Your subscription automatically renews and you will be automatically billed until we receive notification that
          you want to cancel the subscription. To cancel your subscription, please follow these steps: 1. Go to your
          account at newstart.com/online/. 2. Choose &quot;Profile&quot;. 3.Choose &quot;Account&quot;. 4. Choose
          &quot;Cancel subscription&quot;.
        </Typography>
        <Typography variant="h4" sx={{ pb: 3, color: '#5A5A72' }}>
          Free Trial
        </Typography>
        <Typography variant="body1" sx={{ pb: 3 }}>
          We offer the following free trial of our services: A 7 day free trial that begins when users register for a
          new account. The free trial includes unlimited access to all components of week 1 material on our site. At the
          end of your free trial, the following will occur: You will be prompted to upgrade to either a monthly or
          yearly subscription at the respective rate. To cancel your free trial, please follow these steps: The free
          trial automatically cancels if you do not upgrade.
        </Typography>
        <Typography variant="h4" sx={{ pb: 3, color: '#5A5A72' }}>
          Payments
        </Typography>
        <Typography variant="body1" sx={{ pb: 3 }}>
          We accept the following payment methods on our Site:  Credit Card. When you provide us with your payment
          information, you authorize our use of and access to the payment instrument you have chosen to use. By
          providing us with your payment information, you authorize us to charge the amount due to this payment
          instrument. If we believe your payment has violated any law or these Terms and Conditions, we reserve the
          right to cancel or reverse your transaction.
        </Typography>
        <Typography variant="h4" sx={{ pb: 3, color: '#5A5A72' }}>
          Consumer Protection Law
        </Typography>

        <Typography variant="body1" sx={{ pb: 3 }}>
          Where any consumer protection legislation in your jurisdiction applies and cannot be excluded, these Terms and
          Conditions will not limit your legal rights and remedies under that legislation. These Terms and Conditions
          will be read subject to the mandatory provisions of that legislation. If there is a conflict between these
          Terms and Conditions and that legislation, the mandatory provisions of the legislation will apply.
        </Typography>
        <Typography variant="h4" sx={{ pb: 3, color: '#5A5A72' }}>
          Limitation of Liability
        </Typography>
        <Typography variant="body1" sx={{ pb: 3 }}>
          NEWSTART Online and our directors, officers, agents, employees, subsidiaries, and affiliates will not be
          liable for any actions, claims, losses, damages, liabilities and expenses including legal fees from your use
          of the Site.
        </Typography>

        <Typography variant="h4" sx={{ pb: 3, color: '#5A5A72' }}>
          Indemnity
        </Typography>
        <Typography variant="body1" sx={{ pb: 3 }}>
          Except where prohibited by law, by using this Site you indemnify and hold harmless NEWSTART Online and our
          directors, officers, agents, employees, subsidiaries, and affiliates from any actions, claims, losses,
          damages, liabilities and expenses including legal fees arising out of your use of our Site or your violation
          of these Terms and Conditions.
        </Typography>
        <Typography variant="h4" sx={{ pb: 3, color: '#5A5A72' }}>
          Applicable Law
        </Typography>
        <Typography variant="body1" sx={{ pb: 3 }}>
          These Terms and Conditions are governed by the laws of the State of California.
        </Typography>

        <Typography variant="h4" sx={{ pb: 3, color: '#5A5A72' }}>
          Severability
        </Typography>
        <Typography variant="body1" sx={{ pb: 3 }}>
          If at any time any of the provisions set forth in these Terms and Conditions are found to be inconsistent or
          invalid under applicable laws, those provisions will be deemed void and will be removed from these Terms and
          Conditions. All other provisions will not be affected by the removal and the rest of these Terms and
          Conditions will still be considered valid.
        </Typography>

        <Typography variant="h4" sx={{ pb: 3, color: '#5A5A72' }}>
          Changes
        </Typography>
        <Typography variant="body1" sx={{ pb: 3 }}>
          These Terms and Conditions may be amended from time to time in order to maintain compliance with the law and
          to reflect any changes to the way we operate our Site and the way we expect users to behave on our Site. We
          will notify users by email of changes to these Terms and Conditions or post a notice on our Site.
        </Typography>

        <Typography variant="h4" sx={{ pb: 3, color: '#5A5A72' }}>
          Contact Details
        </Typography>
        <Typography variant="body1" sx={{ pb: 3 }}>
          Please contact us if you have any questions or concerns. Our contact details are as follows:
          <br />
          (800) 525-9192
          <br />
          online@newstart.com 2601
          <br />
          West Paoli Lane, Weimar, CA 95736
        </Typography>
      </Container>
    </Box>
  );
};

export default TermsAndConditions;
