
import { jsx } from '@emotion/react'
import {
  Fragment,
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { RouteProps, useHistory, useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCar } from '@fortawesome/free-solid-svg-icons'

import { Text, Container, Row, Col, Screen, Button, Input, Loading } from '~/components'
import { RequiredInformationModal, PriorIncidentsModal } from '~/screens/modals'
import { utils, theme } from '~/styles'
import { useLocale, useQuote, useError, useAuth } from '~/hooks'
import { AdditionalInterestInfo, CommunicationInfo, CustomError, LossHistoryInfo, QuoteDetail } from '~/types'

import { CarCovered, ReviewItem } from './../components'
import { styles } from './../styles'
import { logger } from '~/utils'
import { UserInfoModal } from '~/screens/modals/user-info'
import { AdditionalInterestModal } from '~/screens/modals/additional-interest'
import { LossHistoryModal } from '~/screens/modals/loss-history/multi-quote'

/**
 * @deprecated multi policy aproach
 */
export const ReviewCoveragesScreen: FunctionComponent<RouteProps> = () => {
  const router = useRouter()
  const { messages } = useLocale()
  const { quoteNumber } = useParams<any>()
  const { quoteDetail, selectedPlan, updateQuote, convertToApplication, externalApplicationCloseOut} = useQuote()
  const { user } = useAuth()
  const { setError } = useError()

  const [selectedTab, selectTab] = useState(1)
  const [requiredInformationModalVisible, setRequiredInformationModalVisible] = useState({ required: false, from: null })
  const [priorIncidentsVisible, setPriorIncidentsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [isLoading, setLoading] = useState(false)

  const [userInfoRequired, setUserInfoVisible] = useState(false)

  // DEV Notes: For automatic process when the continue to checkout is clicked, but there are some required fields. Need to find a better solution here!!!
  const [hasProceedToCheckout, setProceedToCheckout] = useState(0)

  const [additionalInterestRequired, setAdditionalInterestVisible] = useState(false)
  const [lossHistoryRequired, setLossHistoryVisible] = useState(false)

  const delay = ms => new Promise(res => setTimeout(res, ms));

  const requiredItemsLabel = useMemo(() => {
    return [
      ...quoteDetail.vehicles
        .filter(
          (v) =>
            v.status === 'Active' &&
            (v.vinNumber === undefined ||
              v.odometerReading === undefined ||
              v.readingDate === undefined),
        )
        .map(
          (info) =>
            `${[
              info.vinNumber ? undefined : 'Vin Number',
              info.odometerReading && info.readingDate ? undefined : 'Odometer',
            ]
              .filter((v) => !!v)
              .join(',')} - ${info.model}`,
        ),
      ...quoteDetail.drivers
        .filter((v) => v.status === 'Active' && v.licenseNumber === '')
        .map((info) => `${info.firstName} - ${messages.DriverModal.LicenseNumber}`),
    ]
  }, [quoteDetail])

  const processUpdateQuote = useCallback((updatedQuote: QuoteDetail) => {
    setLoading(true)
    updateQuote(updatedQuote)
      .then(() => {

      })
      .catch((e) => {
        setError(e)
      }).finally(() => setLoading(false))
  }, [])

  const processConvertToApplication = useCallback((updatedQuote: QuoteDetail) => {
    setLoading(true)
    updateQuote(updatedQuote).then(() => {
      convertToApplication()
        .then(async ({ applicationNumber, isPremiumUpdated }) => {
          logger(new Date())
          await delay(10000).then(() => {
            logger(new Date())
            externalApplicationCloseOut({ ...quoteDetail, communicationInfo: updatedQuote.communicationInfo })
              .then(() => {
                setLoading(false)
                if (isPremiumUpdated) {
                  setPriorIncidentsVisible(true)
                  router.replace(`/quote/${applicationNumber}/review`)
                } else {
                  router.replace(`/quote/${applicationNumber}/checkout`)
                }
              })
              .catch((e) => {
                setError(e)
              })
          })
        })
        .catch((e) => {
          setError(e)
        })
    })
    .catch((e) => {
      setError(e)
    })
  }, [])


  const onContinueToCheckout = useCallback((from?: string) => {
    if (requiredItemsLabel.length > 0) {
      setProceedToCheckout(1)
      setRequiredInformationModalVisible({ required: true, from: 'mainFlow' })
    } else if (quoteDetail.planInfo[selectedPlan].isQuote) {

      if ((requiredInformationModalVisible.from && requiredInformationModalVisible.from === 'mainFlow') || from === 'mainFlow') {
        setUserInfoVisible(true)
      }
    } else {
      setLoading(true)
      externalApplicationCloseOut(quoteDetail)
        .then(() => {
          setLoading(false)
          router.push('checkout')
        })
        .catch((e) => {
          //const { errorType, errorData } = e as CustomError
          //setError([new CustomError(errorType, { ...(errorData || {}), quoteNumber })])
          setError(e)
        })

    }
  }, [quoteDetail, selectedPlan])


  useEffect(() => {
    (window as any).ga && (window as any).ga('send', 'Review Page View')
  }, [])

  logger('quoteDetail', quoteDetail)
  logger('selectedPlan', selectedPlan)

  return (
    <Screen
      title={`${quoteNumber} | ${messages.MainTitle}`}
      greyBackground
      breadCrumb={[
        { link: '/', label: 'Home' },
        { link: 'customize', label: 'Customize' },
        { label: 'Review Coverages' },
      ]}
      loading={isLoading}
      css={[utils.flex(1), utils.flexDirection('column')]}
      quoteNumber={quoteNumber}
      systemId={quoteDetail.systemId}
    >
      {/* Mobile Tabs */}
      <Container css={[utils.fullWidth, utils.visibleOnMobile, utils.ma(0), utils.pa(0)]}>
        <Row css={utils.flexWrap('nowrap')}>
          <Col
            css={[styles.tabSelector, selectedTab === 1 && styles.selectedTab]}
            onClick={() => selectTab(1)}
          >
            <img
              height="12px"
              src='/assets/icons/car1.png'
              css={utils.mr(1)}
            />
            <Text bold>{messages.Common.Policy}</Text>
          </Col>
          <Col
            css={[styles.tabSelector, selectedTab === 2 && styles.selectedTab]}
            onClick={() => selectTab(2)}
          >
            <img
              height="12px"
              src='/assets/icons/car2.png'
              css={utils.mr(1)}
            />
            <Text bold>{messages.Common.Cars}</Text>
          </Col>
          <Col
            css={[styles.tabSelector, selectedTab === 3 && styles.selectedTab]}
            onClick={() => selectTab(3)}
          >
            <img
              height="12px"
              src='/assets/icons/steering.png'
              css={utils.mr(1)}
            />
            <Text bold>{messages.Common.Drivers}</Text>
          </Col>
          <Col
            css={[styles.tabSelector, selectedTab === 4 && styles.selectedTab]}
            onClick={() => selectTab(4)}
          >
            <img
              height="12px"
              src='/assets/icons/car1.png'
              css={utils.mr(1)}
            />
            <Text bold>{messages.Common.RequiredItems}</Text>
          </Col>
        </Row>
      </Container>

      <Container
        css={[utils.fullWidth, utils.visibleOnMobile, utils.my(3), utils.centerAlign]}
      >
        <Text>{quoteNumber}</Text>
      </Container>

      <Container wide css={[utils.my('40px'), utils.hideOnMobile]}>
        <Text size="2.5em" bold>
          {messages.ReviewCoverages.Title}
        </Text>
      </Container>

      <Container wide css={[utils.my('20px'), utils.visibleOnMobile]}>
        <Text
          size="2.5em"
          bold
          textAlign="center"
          css={utils.fullWidth}
          color={theme.color.primary}
        >
          {messages.ReviewCoverages.MobileTitle}
        </Text>
      </Container>

      <Container wide css={utils.hideOnMobile}>
        <Row css={utils.fullWidth}>
          <Col md={12} lg={9}>
            {/* auto policy */}
            <div css={[styles.whiteBackground, styles.autoPolicy]}>
              <Text size="2.5em" bold css={utils.mb(7)}>
                <img src='/assets/icons/car1.png' css={utils.mr(1)} />
                {messages.ReviewCoverages.AutoPolicy}
              </Text>

              {/* Drivers Covered */}
              <div>
                <Text size="2em" bold css={utils.mb(5)}>
                  {messages.ReviewCoverages.DriversCovered}
                </Text>

                <Row>
                  <Col>
                    {quoteDetail.drivers
                      .filter((driver) => driver.status === 'Active')
                      .map((driver, key) => (
                        <div css={styles.infoItem} key={key}>
                          <Text bold>
                            {driver.firstName} {driver.lastName}
                          </Text>
                          <Text size="1.25em" bold>
                            {driver.age} Years
                          </Text>
                        </div>
                      ))}

                    <div css={styles.infoItem}></div>
                  </Col>

                  <Col>
                    <div css={[styles.infoItem, utils.height('4.5em')]}>
                      <Text bold>{messages.ReviewCoverages.TotalTermPrice}</Text>
                      <Text size="2em" bold>
                        {/*${quoteDetail.planInfo[selectedPlan].fullPrice}*/}
                        ${Math.round(+quoteDetail.planInfo[selectedPlan].fullPrice).toString()}
                      </Text>
                    </div>
                    <div css={styles.infoItem}>
                      <Text bold>{messages.ReviewCoverages.PolicyTermPrice}</Text>
                      <Text size="1.25em" bold>
                        {quoteDetail.planInfo[selectedPlan].renewalTerm}
                      </Text>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Limits */}
              <div>
                <Text size="2em" bold css={utils.my(5)}>
                  {messages.ReviewCoverages.Limits}
                </Text>

                <Row>
                  <Col xs={7}>
                    <div css={styles.infoItem}>
                      <Text bold>{messages.ReviewCoverages.BodilyInjury}</Text>
                      <Text size="1.25em" bold>
                        {quoteDetail.planInfo[selectedPlan].bodilyInjuryLimit
                          .split('/')
                          .map((str) => `$${str}`)
                          .join('/')}
                      </Text>
                    </div>
                    <div css={styles.infoItem}>
                      <Text bold>{messages.ReviewCoverages.UninsuredMotorist}</Text>
                      <Text size="1.25em" bold>
                        {quoteDetail.planInfo[selectedPlan].uninsuredMotoristLimit
                          .split('/')
                          .map((str) => `$${str}`)
                          .join('/')}
                      </Text>
                    </div>
                    <div css={styles.infoItem}>
                      <Text bold>
                        {messages.ReviewCoverages.UninsuredMotoristPropertyDamage}
                      </Text>
                      <Text size="1.25em" bold>
                        {quoteDetail.planInfo[selectedPlan].UM_PD_WCD_Applies}
                      </Text>
                    </div>
                  </Col>

                  <Col xs={5}>
                    <div css={styles.infoItem}>
                      <Text bold>{messages.ReviewCoverages.MedicalPayments}</Text>
                      <Text size="1.25em" bold>
                        ${quoteDetail.planInfo[selectedPlan].medicalPaymentsLimit}
                      </Text>
                    </div>
                    <div css={styles.infoItem}>
                      <Text bold>{messages.ReviewCoverages.PropertyDamage}</Text>
                      <Text size="1.25em" bold>
                        ${quoteDetail.planInfo[selectedPlan].propertyDamage}
                      </Text>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>

            {/* Cars Covered */}
            <div css={utils.my(4)}>
              <Text size="2em" bold css={utils.my(6)}>
                {messages.ReviewCoverages.CarsCovered}
              </Text>

              {quoteDetail.planInfo[selectedPlan].vehicleInfo
                .filter((vehicle) => vehicle.status === 'Active')
                .map((vehicle, key) => (
                  <CarCovered css={utils.mb(5)} vehicle={vehicle} key={key} />
                ))}
            </div>
          </Col>

          <Col md={12} lg={3}>
            <div css={[styles.whiteBackground, utils.pa(2), utils.fullHeight]}>
              {
                requiredItemsLabel.length > 0
                &&
                <ReviewItem
                  css={utils.mt(5)}
                  header={messages.Customize.RequiredInformation}
                  items={requiredItemsLabel}
                  onEdit={() => {
                    setProceedToCheckout(0)
                    setRequiredInformationModalVisible({ required: true, from: null })
                  }}
                />
              }

              <ReviewItem
                css={utils.mt(5)}
                header={messages.ReviewCoverages.ShareThisQuote}
              >
                <div
                  css={[
                    utils.display('flex'),
                    utils.flexDirection('column'),
                    utils.alignItems('center'),
                    utils.py(3),
                  ]}
                >
                  <Text css={[utils.fullWidth, utils.my(4)]}>
                    {messages.ReviewCoverages.ShareQuoteDescription}
                  </Text>
                  <Input
                    type="email"
                    css={[utils.fullWidth, utils.mb(3)]}
                    placeholder={messages.Common.EmailAddress}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button>{messages.ReviewCoverages.ShareQuote}</Button>
                </div>
              </ReviewItem>


              <ReviewItem
                css={utils.mt(5)}
                header={messages.ReviewCoverages.AgentInformation}
              >
                <Text color={theme.color.primary} bold css={utils.my(3)}>
                  {user && user.DTOProvider.Contact && user.DTOProvider.Contact[0].PartyInfo[0].NameInfo[0].CommercialName}
                </Text>

                <div css={styles.infoItem}>
                  <Text bold>{messages.Common.Agent}</Text>
                  <Text>
                    {user && user.DTOProvider.Contact && user.DTOProvider.Contact[0].PartyInfo[0].PersonInfo[0].PositionTitle}
                  </Text>
                </div>
                <div css={styles.infoItem}>
                  <Text bold>{messages.Common.Phone}</Text>
                  <Text>
                    {user && user.DTOProvider.Contact &&
                      user.DTOProvider.Contact[0].PartyInfo[0].PhoneInfo.find(
                        (phoneInfo) => phoneInfo.PhoneName === 'Business',
                      )?.PhoneNumber
                    }
                  </Text>
                </div>
                <div css={styles.infoItem}>
                  <Text bold>{messages.Common.Email}</Text>
                  <Text>
                    {user && user.DTOProvider.Contact && user.DTOProvider.Contact[0].PartyInfo[0].EmailInfo[0].EmailAddr}
                  </Text>
                </div>
              </ReviewItem>

              <ReviewItem
                css={utils.mt(3)}
                header={messages.AIModal.Title}
                onEdit={() => {
                  setProceedToCheckout(0)
                  setAdditionalInterestVisible(true)
                }}
              />
              <ReviewItem
                css={utils.mt(3)}
                header={'Loss History'}
                onEdit={() => {
                  setLossHistoryVisible(true)
                }}
              />
            </div>
          </Col>
        </Row>
      </Container>

      <Container wide css={[utils.visibleOnMobile, utils.flex(1)]}>
        {/* Policy */}
        {selectedTab === 1 && (
          <Fragment>
            <div css={[styles.whiteBackground, utils.pa(3)]}>
              <div css={styles.infoItem}>
                <Text bold>{messages.ReviewCoverages.TotalTermPrice}</Text>
                <Text size="2em" bold>
                  {/*${quoteDetail.planInfo[selectedPlan].fullPrice}*/}
                  ${Math.round(+quoteDetail.planInfo[selectedPlan].fullPrice).toString()}
                </Text>
              </div>
              <div css={styles.infoItem}>
                <Text bold>{messages.ReviewCoverages.PolicyTermPrice}</Text>
                <Text size="1.25em" bold>
                  ${quoteDetail.planInfo[selectedPlan].renewalTerm}
                </Text>
              </div>
              <div css={styles.infoItem}>
                <Text bold>{messages.ReviewCoverages.BodilyInjury}</Text>
                <Text size="1.25em" bold>
                  {quoteDetail.planInfo[selectedPlan].bodilyInjuryLimit
                    .split('/')
                    .map((str) => `$${str}`)
                    .join('/')}
                </Text>
              </div>
              <div css={styles.infoItem}>
                <Text bold>{messages.ReviewCoverages.UninsuredMotorist}</Text>
                <Text size="1.25em" bold>
                  {quoteDetail.planInfo[selectedPlan].uninsuredMotoristLimit
                    .split('/')
                    .map((str) => `$${str}`)
                    .join('/')}
                </Text>
              </div>
              <div css={styles.infoItem}>
                <Text bold>{messages.ReviewCoverages.MedicalPayments}</Text>
                <Text size="1.25em" bold>
                  ${quoteDetail.planInfo[selectedPlan].medicalPaymentsLimit}
                </Text>
              </div>
              <div css={styles.infoItem}>
                <Text bold>{messages.ReviewCoverages.PropertyDamage}</Text>
                <Text size="1.25em" bold>
                  ${quoteDetail.planInfo[selectedPlan].propertyDamage}
                </Text>
              </div>
              <div css={styles.infoItem}>
                <Text bold>
                  {messages.ReviewCoverages.UninsuredMotoristPropertyDamage}
                </Text>
                <Text size="1.25em" bold>
                  {quoteDetail.planInfo[selectedPlan].UM_PD_WCD_Applies}
                </Text>
              </div>
            </div>
            <ReviewItem
              css={utils.mt(3)}
              header={messages.ReviewCoverages.ShareThisQuote}
            >
              <div
                css={[
                  utils.display('flex'),
                  utils.flexDirection('column'),
                  utils.alignItems('center'),
                ]}
              >
                <Text css={[utils.fullWidth, utils.my(4)]}>
                  {messages.ReviewCoverages.ShareQuoteDescription}
                </Text>
                <div css={[utils.display('flex'), utils.fullWidth]}>
                  <Input
                    type="email"
                    css={[utils.flex(1), utils.mb(3)]}
                    placeholder={messages.Common.EmailAddress}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button>{messages.ReviewCoverages.ShareQuote}</Button>
                </div>
              </div>
            </ReviewItem>
          </Fragment>
        )}

        {/* Cars */}
        {selectedTab === 2 && (
          <Fragment>
            {quoteDetail.planInfo[selectedPlan].vehicleInfo.map((vehicle, key) => (
              <CarCovered css={utils.mb(5)} vehicle={vehicle} key={key} />
            ))}
          </Fragment>
        )}

        {/* Drivers */}
        {selectedTab === 3 && (
          <div css={[styles.whiteBackground, utils.pa(3)]}>
            {quoteDetail.drivers
              .filter((driver) => driver.status === 'Active')
              .map((driver, key) => (
                <div css={styles.infoItem} key={key}>
                  <Text bold>
                    {driver.firstName} {driver.lastName}
                  </Text>
                  <Text size="1.25em" bold>
                    {driver.age} Years
                  </Text>
                </div>
              ))}
          </div>
        )}

        {selectedTab === 4 && (
          <div css={[styles.whiteBackground, utils.pa(3)]}>
            {(
              [quoteDetail.vehicles
                .filter(
                  (v) =>
                    v.status === 'Active' &&
                    (v.vinNumber === undefined ||
                      v.odometerReading === undefined ||
                      v.readingDate === undefined),
                )
                .map(
                  (info) =>
                    `${[
                      info.vinNumber ? undefined : 'Vin Number',
                      info.odometerReading && info.readingDate ? undefined : 'Odometer',
                    ]
                      .filter((v) => !!v)
                      .join(',')} - ${info.model}`,
                )]).length > 0 &&
              <ReviewItem
                css={utils.mt(3)}
                header={messages.Customize.RequiredInformation}
                items={quoteDetail.vehicles
                  .filter(
                    (v) =>
                      v.status === 'Active' &&
                      (v.vinNumber === undefined ||
                        v.odometerReading === undefined ||
                        v.readingDate === undefined),
                  )
                  .map(
                    (info) =>
                      `${[
                        info.vinNumber ? undefined : 'Vin Number',
                        info.odometerReading && info.readingDate ? undefined : 'Odometer',
                      ]
                        .filter((v) => !!v)
                        .join(',')} - ${info.model}`,
                  )}
                onEdit={() => setRequiredInformationModalVisible({ required: true, from: null })}
              />
            }
            <ReviewItem
              css={utils.mt(3)}
              header={messages.AIModal.Title}
              onEdit={() => {
                setProceedToCheckout(0)
                setAdditionalInterestVisible(true)
              }}
            />
            <ReviewItem
              css={utils.mt(3)}
              header={'Loss History'}
              onEdit={() => {
                setLossHistoryVisible(true)
              }}
            />
          </div>
        )}
      </Container>

      {/* Footer */}
      <div css={[utils.centerAlign, utils.mt(5), utils.pa(3), styles.footer]}>
        <div css={[utils.centerAlign, utils.pa(3)]}>
          <Text bold color={theme.color.primary} css={utils.mr(4)} size="1.25em">
            {quoteDetail.planInfo[selectedPlan].planType} {messages.Common.Plan}
          </Text>
          <Text bold size="1.25em">
            <FontAwesomeIcon icon={faCar} css={utils.mr(2)} />
            {/*${quoteDetail.planInfo[selectedPlan].fullPrice}*/}
            ${Math.round(+quoteDetail.planInfo[selectedPlan].fullPrice).toString()}
          </Text>
        </div>
        <Button onClick={() => onContinueToCheckout('mainFlow')}>
          {messages.Common.ContinueToCheckout}
        </Button>
      </div>

      {/* Modals */}
      <RequiredInformationModal
        isOpen={requiredInformationModalVisible.required}
        defaultValue={quoteDetail}
        onCloseModal={() => setRequiredInformationModalVisible({ required: false, from: null })}
        onUpdate={(v) => {
          setLoading(true)
          setProceedToCheckout(2)

          updateQuote(v)
            .then(() => {
              setLoading(false)
            })
            .catch((e) => {
              //const { errorType, errorData } = e as CustomError
              //setError([new CustomError(errorType, { ...(errorData || {}), quoteNumber })])
              setError(e)
            })
        }}
      />

      <PriorIncidentsModal
        isOpen={priorIncidentsVisible}
        onCloseModal={() => setPriorIncidentsVisible(false)}
        onConfirm={() => {
          setPriorIncidentsVisible(false)
          router.push('checkout')
        }}
      />

      <UserInfoModal
        isOpen={userInfoRequired}
        communicationInfo={quoteDetail.communicationInfo}
        onCloseModal={() => setUserInfoVisible(false)}
        onUpdate={(communicationInfo: CommunicationInfo) => {
          processConvertToApplication({
            ...quoteDetail,
            communicationInfo: communicationInfo
          })

        }}
      />

      <AdditionalInterestModal
        additionalInterest={quoteDetail.additionalInterest}
        vehicles={quoteDetail.planInfo[selectedPlan].vehicleInfo}
        isOpen={additionalInterestRequired}
        onCloseModal={() => setAdditionalInterestVisible(false)}
        onUpdate={(additionalInterestInfo: Array<AdditionalInterestInfo>) => {
          processUpdateQuote({
            ...quoteDetail,
            additionalInterest: additionalInterestInfo
          })
        }}
      />

      <LossHistoryModal
        isOpen={lossHistoryRequired}
        onCloseModal={() => setLossHistoryVisible(false)}
        lossHistory={quoteDetail.lossHistory}
        onUpdate={(lhInfo: Array<LossHistoryInfo>) => {
          processUpdateQuote({
            ...quoteDetail,
            lossHistory: lhInfo
          })
        }}
      />
    </Screen>
  )
}
