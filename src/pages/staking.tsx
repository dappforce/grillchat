import ContentStakingPage from 'src/modules/ContentStakingPage'

export const getStaticProps = () => {
  return {
    props: {
      head: {
        title: 'Join The Creator Economy On Subsocial',
        description:
          "Earn rewards when you post content or engage with others in Subsocial's Content Staking system. Lock some SUB to get started today!",
        image: 'https://grillapp.net/c/staking-meta-bg.jpg',
      },
    },
  }
}

export default ContentStakingPage
