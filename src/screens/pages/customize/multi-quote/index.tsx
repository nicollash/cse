
import { jsx } from '@emotion/react'
import { FunctionComponent, useState, useEffect, useCallback, useMemo } from 'react'
import { RouteProps, useHistory, useParams } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCar, faPlus, faArrowRight } from '@fortawesome/free-solid-svg-icons'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '~/styles/components/slider.css'

import { Screen, Container, Text, Row, Col, Button } from '~/components'
import {
  AddVehicleModal,
  EditVehicleModal,
  DeleteVehicleModal,
  EditDriverModal,
  DiscountsModal,
  RequiredInformationModal,
  AutoPolicyModal,
  DeleteDriverModal} from '~/screens/modals'
import { utils, theme } from '~/styles'
import { AdditionalInterestInfo, CustomError, DefaultDriverInfo, DriverPointsInfo, LossHistoryInfo, PlanType, PlanTypes, QuoteDetail } from '~/types'

import { getNewDriverParam, logger } from '~/utils'

import { ItemBlock, ListItem, ReviewItem, PlanItem } from './../components'
import { styles } from './../styles'
import { useError, useLocale, useQuote } from '~/hooks'
import { AdditionalInterestModal } from '~/screens/modals/additional-interest'
import { LossHistoryModal } from '~/screens/modals/loss-history/multi-quote'

/**
 * @deprecated for multi plicy aproach
 */
export const CustomizeScreen: FunctionComponent<RouteProps> = ({ location }) => {
  const router = useRouter()
  const { messages } = useLocale()
  const { setError } = useError()
  const { quoteNumber } = useParams<any>()
  const {
    quoteDetail,
    updateQuote,
    updateQuoteDetail,
    selectedPlan: preSelectedPlan,
    setSelectedPlan,
    addDriver,
    addVehicle,
    updateDriverPoints,
    externalApplicationCloseOut,    
  } = useQuote()
  

  // modal visibilities
  const [addCarVisible, setAddCarVisible] = useState(false)
  const [editCarIndex, setEditCarIndex] = useState(null)
  const [deleteCarIndex, setDeleteCarIndex] = useState(null)
  const [editDriverIndex, setEditDriverIndex] = useState(null)
  const [deleteDriverIndex, setDeleteDriverIndex] = useState(null)
  const [discountsModalVisible, setDiscountsModalVisible] = useState(false)
  const [requiredInformationModalVisible, setRequiredInformationModalVisible] = useState(
    false,
  )
  const [autoPolicyModalVisible, setAutoPolicyModalVisible] = useState(false)

  const [selectedPlan, selectPlan] = useState<PlanType>(preSelectedPlan || 'Standard')
  const [selectedTab, selectTab] = useState(1)
  const [showDetail, setShowDetail] = useState(false)
  const [reviewableItems, setReviewableItems] = useState([])
  const [isLoading, setLoading] = useState(false)

  const [additionalInterestRequired, setAdditionalInterestVisible] = useState(false)
  const [lossHistoryRequired, setLossHistoryVisible] = useState(false)

  const sliderSettings = useMemo(
    () => ({
      arrows: false,
      focusOnSelect: false,
      dots: true,
      infinite: false,
      slidesToShow: 3,
      slidesToScroll: 1,
      initialSlide: selectedPlan,
      swipeToSlide: true,
      customPaging: () => (
        <div className="slick-dot-custom">
          <FontAwesomeIcon icon={faArrowRight} color="white" />
        </div>
      ),
      beforeChange: (oldIndex, newIndex) => selectPlan(PlanTypes[newIndex]),
      responsive: [
        {
          breakpoint: 960,
          settings: {
            slidesToShow: 1,
          },
        },
      ],
    }),
    [],
  )

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
                info.odometerReading && info.readingDate
                  ? undefined
                  : 'Odometer',
              ]
                .filter((v) => !!v)
                .join(',')} - ${info.model}`,
          ),
        ...quoteDetail.drivers
          .filter((v) => v.status === 'Active' && v.licenseNumber === '')
          .map(
            (info) =>
              `${info.firstName} - ${messages.DriverModal.LicenseNumber}`,
          )
    ]
  }, [quoteDetail])

  const getAssignedDriverName = useCallback(
    (vehicle) => {
      const primaryDriverRef = quoteDetail.vehicles.find(
        (v) => v.vinNumber === vehicle.vinNumber || v.vehNumber === vehicle.vehNumber,
      )
      const driver = quoteDetail.drivers.find(
        (driver) => driver.id === primaryDriverRef?.primaryDriver,
      )
      return driver ? `${driver.firstName} ${driver.lastName}` : ''
    },
    [quoteDetail],
  )

  const processCheckout = useCallback((selectedPlan: PlanType) => {
    setSelectedPlan(selectedPlan)
    router.push('review')
  }, [])

  const processUpdateQuote = useCallback((newQuoteDetail: QuoteDetail) => {
    setLoading(true)
    updateQuote(newQuoteDetail)
      .then(() => {
        setLoading(false)
      })
      .catch((e) => {
        setError(e)
      })
  }, [])
  
  const processUpdateDriverPoints = useCallback((action:string, driverNumber:string, newDriverPoints: DriverPointsInfo) => {
    setLoading(true)
    updateDriverPoints(action, driverNumber, newDriverPoints)
      .then(() => {
        setLoading(false)
      })
      .catch((e) => {
        setError(e)
      })
  }, [])

  const processExternalApplicationCloseOut = useCallback((updatedQuote: QuoteDetail) => {
    setLoading(true)
    externalApplicationCloseOut(updatedQuote)
      .then(() => {
        setLoading(false)
      })
      .catch((e) => {
        setError(e)
      })
  }, [])

  // effects
  useEffect(() => {
    (window as any).ga && (window as any).ga('send', 'Customize Page View')

    setReviewableItems([
      ...quoteDetail.vehicles
        .filter((vehicle) => vehicle.status === 'Active')
        .map((vehicle) => vehicle.id),
      ...quoteDetail.drivers
        .filter((driver) => driver.status === 'Active')
        .map((driver) => driver.id),
    ])
  }, [])

  return (
    <Screen
      title={`${quoteNumber} | ${messages.MainTitle}`}
      greyBackground
      breadCrumb={[{ link: '/', label: 'Home' }, { label: 'Customize' }]}
      css={[utils.flex(1), utils.flexDirection('column')]}
      loading={isLoading}
      quoteNumber={quoteNumber}
      systemId={quoteDetail.systemId}
    >
      {/* Header */}
      <Container
        wide
        css={[
          utils.display('flex'),
          utils.alignItems('flex-start'),
          utils.mt('40px'),
          utils.flexWrap(),
          utils.hideOnMobile,
        ]}
      >
        <Text size="2.5em" bold css={[utils.mr(6), utils.py(3)]}>
          {messages.Customize.ChoosePolicy}
        </Text>
        <Text width="450px" css={[utils.py(3)]}>
          {messages.Customize.ChoosePolicyDesc}
        </Text>
      </Container>

      {/* Tabs - Car/Auto for now */}
      <Container
        wide
        css={[
          utils.display('flex'),
          utils.alignItems('flex-start'),
          utils.mt('60px'),
          utils.hideOnMobile,
        ]}
      >
        {/* Header */}
        <div css={[styles.tab, styles.activeTab]}>
          <Text size="2.5em" bold>
            <img src='~/assets/icons/car1.png' css={utils.mr(1)} />
            {messages.Common.Car}
          </Text>
        </div>
      </Container>

      {/* Mobile Tabs */}
      <Container css={[utils.fullWidth, utils.visibleOnMobile, utils.pa(0)]}>
        <Row css={utils.flexWrap('nowrap')}>
          <Col
            data-testid="mobile-tab-policy"
            css={[styles.tabSelector, selectedTab === 1 && styles.selectedTab]}
            onClick={() => selectTab(1)}
          >
            <img
              height="12px"
              src='~/assets/icons/car1.png'
              css={utils.mr(1)}
            />
            <Text bold>{messages.Common.Policy}</Text>
          </Col>
          <Col
            data-testid="mobile-tab-cars"
            css={[styles.tabSelector, selectedTab === 2 && styles.selectedTab]}
            onClick={() => selectTab(2)}
          >
            <img
              height="12px"
              src='~/assets/icons/car2.png'
              css={utils.mr(1)}
            />
            <Text bold>{messages.Common.Cars}</Text>
          </Col>
          <Col
            data-testid="mobile-tab-drivers"
            css={[styles.tabSelector, selectedTab === 3 && styles.selectedTab]}
            onClick={() => selectTab(3)}
          >
            <img
              height="12px"
              src='~/assets/icons/steering.png'
              css={utils.mr(1)}
            />
            <Text bold>{messages.Common.Drivers}</Text>
          </Col>
          <Col
            data-testid="mobile-tab-reviewItems"
            css={[styles.tabSelector, selectedTab === 4 && styles.selectedTab]}
            onClick={() => selectTab(4)}
          >
            <img
              height="12px"
              src='~/assets/icons/car1.png'
              css={utils.mr(1)}
            />
            <Text bold>{messages.Common.ReviewItems}</Text>
          </Col>
        </Row>
      </Container>

      <Container
        data-testid="text-quotenumber"
        css={[utils.fullWidth, utils.visibleOnMobile, utils.my(3), utils.centerAlign]}
      >
        <Text>{quoteNumber}</Text>
      </Container>

      {/* Items */}
      <div
        css={[
          styles.whiteBackground,
          utils.py('80px'),
          selectedTab === 1 && utils.hideOnMobile,
        ]}
      >
        <Container wide css={utils.display('flex')}>
          <Row css={[utils.fullWidth, styles.row]}>
            <Col css={[selectedTab !== 2 && utils.hideOnMobile]} xl={3} lg={4} md={12}>
              <ItemBlock
                data-testid="block-vehicles"
                icon='~/assets/icons/car2.png'
                headerText={messages.Common.Cars}
              >
                {quoteDetail.vehicles.map(
                  (vehicle, key) =>
                    vehicle.status === 'Active' && (
                      <ListItem
                        data-testid={`vehicle-${key}`}
                        key={key}
                        text={vehicle.model}
                        onEdit={() => setEditCarIndex(key)}
                        onDelete={() => setDeleteCarIndex(key)}
                      />
                    ),
                )}

                <Button
                  data-testid="button-add-vehicle"
                  width="120px"
                  css={utils.mt(5)}
                  onClick={() => setAddCarVisible(true)}
                >
                  <Text color="white">
                    <FontAwesomeIcon icon={faPlus} css={utils.mr(2)} />
                    {messages.Customize.Add}
                  </Text>
                </Button>
              </ItemBlock>
            </Col>

            <Col css={[selectedTab !== 3 && utils.hideOnMobile]} xl={3} lg={4} md={12}>
              <ItemBlock
                data-testid="block-drivers"
                icon='~/assets/icons/steering.png'
                headerText={messages.Common.Drivers}
              >
                {quoteDetail.drivers.map(
                  (driver, key) =>
                    driver.status === 'Active' && (
                      <ListItem
                        data-testid={`driver-${key}`}
                        text={`${driver.firstName} ${driver.lastName}`}
                        key={key}
                        onEdit={() => setEditDriverIndex(key)}
                        onDelete={() => setDeleteDriverIndex(key)}
                      />
                    ),
                )}
                <Button
                  data-testid="button-add-driver"
                  width="120px"
                  css={utils.mt(5)}
                  onClick={() => setEditDriverIndex('new')}
                >
                  <Text color="white">
                    <FontAwesomeIcon icon={faPlus} css={utils.mr(2)} />
                    {messages.Customize.Add}
                  </Text>
                </Button>
              </ItemBlock>
            </Col>

            <div css={utils.flex(1)} />

            <Col css={[selectedTab !== 4 && utils.hideOnMobile]} xl={3} lg={4} md={12}>
              <ItemBlock
                data-testid="block-review-items"
                css={styles.reviewItems}
                icon='~/assets/icons/car1.png'
                headerText={messages.Common.ReviewItems}
              >
                {quoteDetail.vehicles.map(
                  (vehicle, key) =>
                    reviewableItems.includes(vehicle.id) &&
                    vehicle.status === 'Active' && (
                      <ListItem
                        data-testid={`review-item-${vehicle.id}`}
                        key={key}
                        text={vehicle.model}
                        onEdit={() => setEditCarIndex(key)}
                      />
                    ),
                )}
                {quoteDetail.drivers.map(
                  (driver, key) =>
                    reviewableItems.includes(driver.id) &&
                    driver.status === 'Active' && (
                      <ListItem
                        data-testid={`review-item-${driver.id}`}
                        text={`${driver.firstName} ${driver.lastName}`}
                        key={key}
                        onEdit={() => setEditDriverIndex(key)}
                      />
                    ),
                )}
                <ReviewItem
                  data-testid="review-item-discount"
                  css={utils.mt(3)}
                  header={messages.Customize.AppliedDiscounts}
                  items={quoteDetail.discounts
                    .filter((discount) => discount.applied === 'Yes')
                    .map((discount) => discount.description)}
                  onEdit={() => setDiscountsModalVisible(true)}
                />
                {
                  requiredItemsLabel.length > 0
                  &&
                  <ReviewItem
                    data-testid="review-item-required"
                    css={utils.mt(3)}
                    header={messages.Customize.RequiredInformation}
                    items={requiredItemsLabel}
                    onEdit={() => setRequiredInformationModalVisible(true)}
                  />
                }
                <ReviewItem
                  css={utils.mt(3)}
                  header={messages.AIModal.Title}
                  onEdit={() => {
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
              </ItemBlock>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Plan */}
      {!quoteDetail.infoReq ?
        <Container wide css={[utils.flex(1), selectedTab !== 1 && utils.hideOnMobile]}>
          <Row css={[utils.fullWidth, utils.ma(0)]}>
            <Col xl={9} lg={12}>
              <div
                css={[
                  utils.display('flex'),
                  utils.my('30px'),
                  styles.texting,
                  utils.hideOnMobile,
                ]}
              >
                <Text size="2.5em" bold nowrap css={[utils.mr(6), utils.py(3)]}>
                  {messages.Customize.ChoosePlan}
                </Text>
                <div css={[utils.py(3), utils.width('450px')]}>
                  {messages.Customize.ChoosePlanDesc.map((text, index) => (
                    <Text css={utils.mb(3)} key={index}>
                      {text}
                    </Text>
                  ))}
                </div>
              </div>
              <Row css={[utils.display('flex'), utils.alignItems('center'), styles.row]}>
                <Slider css={utils.fullWidth} {...sliderSettings}>
                  {PlanTypes.map((planType) => (
                    <Col css={styles.col} key={planType}>
                      <PlanItem
                        data-testid={planType}
                        planInfo={quoteDetail.planInfo[planType]}
                        onCustomize={() => setAutoPolicyModalVisible(true)}
                        onSelect={() => selectPlan(planType)}
                        selected={selectedPlan === planType}
                        showDetail={showDetail}
                        toggleDetails={() => setShowDetail((state) => !state)}
                        onUpdatePlanInfo={(updatedPlanInfo) => {
                          updateQuoteDetail({
                            planInfo: {
                              ...quoteDetail.planInfo,
                              [planType]: updatedPlanInfo,
                            },
                          })
                        }}
                        onContinueToCheckout={() => {
                          processCheckout(planType)
                        }}
                        changeEffectiveDate={(e) => {
                          processUpdateQuote({
                            ...quoteDetail,
                            planInfo: {
                              ...quoteDetail.planInfo,
                              [planType]: {
                                ...quoteDetail.planInfo[planType],
                                effectiveDate: e,
                              },
                            },
                          })
                        }}
                      />
                    </Col>
                  ))}
                </Slider>
              </Row>
            </Col>
          </Row>
        </Container>
        : null}

      {/* Details */}
      {showDetail && (
        <div css={[styles.whiteBackground, utils.py('20px'), utils.my('40px')]}>
          <Container wide>
            {quoteDetail.planInfo[selectedPlan].vehicleInfo.map((vehicle, key) => (
              <Row key={key} css={[utils.fullWidth, utils.my('20px')]}>
                <Col>
                  <table css={[utils.fullWidth, styles.table]}>
                    <caption>
                      <div
                        css={[
                          utils.display('flex'),
                          utils.justifyContent('space-between'),
                          utils.alignItems('center'),
                        ]}
                      >
                        <Text bold size="1.5em">
                          {vehicle.model} - {vehicle.vinNumber}
                        </Text>
                        <Text bold size="1.5em">
                          Assigned Driver: {getAssignedDriverName(vehicle)}
                        </Text>
                      </div>
                    </caption>
                    <colgroup>
                      <col width="50%" />
                      <col width="25%" />
                      <col width="25%" />
                    </colgroup>
                    <tbody>
                      {vehicle.coverages.map((coverage, key1) => (
                        <tr key={key1}>
                          <td>{coverage.description}</td>
                          <td>
                            <Text css={utils.fullWidth} bold textAlign="right"></Text>
                          </td>
                          <td>
                            <Text css={utils.fullWidth} bold textAlign="right">
                              $ {coverage.amount}
                            </Text>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Col>
              </Row>
            ))}
            <Row css={[utils.fullWidth, utils.my('20px')]}>
              <Col>
                <table css={[utils.fullWidth, styles.table]}>
                  <caption>
                    <div
                      css={[
                        utils.display('flex'),
                        utils.justifyContent('space-between'),
                        utils.alignItems('center'),
                      ]}
                    >
                      <Text bold size="1.5em">
                        Additional Premium &amp; Credits
                      </Text>
                      <Text bold size="1.5em"></Text>
                    </div>
                  </caption>
                  <colgroup>
                    <col width="50%" />
                    <col width="25%" />
                    <col width="25%" />
                  </colgroup>
                  <tbody>
                    {quoteDetail.planInfo[selectedPlan].fees.map((fee, key) => (
                      <tr key={key}>
                        <td>{fee.description}</td>
                        <td>
                          <Text css={utils.fullWidth} bold textAlign="right"></Text>
                        </td>
                        <td>
                          <Text css={utils.fullWidth} bold textAlign="right">
                            $ {fee.amount}
                          </Text>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Col>
            </Row>
          </Container>
        </div>
      )}

      {/* Footer */}
      { !quoteDetail.infoReq ? <div css={[utils.centerAlign, utils.mt(5), utils.pa(3), styles.footer]}>
        <div css={[utils.centerAlign, utils.pa(3)]}>
          <Text bold color={theme.color.primary} css={utils.mr(4)} size="1.25em">
            {quoteDetail.planInfo[selectedPlan].planType} {messages.Common.Plan}
          </Text>
          <Text bold size="1.25em">
            <FontAwesomeIcon icon={faCar} css={utils.mr(2)} />$
            {quoteDetail.planInfo[selectedPlan].paymentPlan === 'monthly'
              ? quoteDetail.planInfo[selectedPlan].monthlyPrice
              : Math.round(+quoteDetail.planInfo[selectedPlan].fullPrice).toString()}
          </Text>
        </div>
        <Button
          onClick={() => {
            processCheckout(selectedPlan)
          }}
        >
          {messages.Common.ContinueToReview}
        </Button>
      </div> : null
      }

      {/* Modals */}
      <AddVehicleModal
        isOpen={addCarVisible}
        onCloseModal={() => setAddCarVisible(false)}
        onAddVehicle={(risk) => {
          setLoading(true)
          addVehicle(risk)
            .then(() => {
              setLoading(false)
            })
            .catch((e) => {
              //logger('catched!', e)
              //const { errorType, errorData } = e as CustomError
              //setError([new CustomError(errorType, { ...(errorData || {}), quoteNumber })])
              setError(e)
            })
        }}
      />
      <EditVehicleModal
        isOpen={editCarIndex !== null}
        defaultValue={quoteDetail.vehicles[editCarIndex]}
        onDeleteVehicle={() => setDeleteCarIndex(editCarIndex)}
        onCloseModal={() => {
          if (editCarIndex !== null) {
            setReviewableItems(
              reviewableItems.filter(
                (id) => id !== quoteDetail.vehicles[editCarIndex].id,
              ),
            )
            setEditCarIndex(null)
          }
        }}
        onUpdate={(updatedValue) => {
          processUpdateQuote({
            ...quoteDetail,
            vehicles: quoteDetail.vehicles.map((v, i) =>
              i === editCarIndex ? updatedValue : v,
            ),
          })
        }}
      />
      <DeleteVehicleModal
        isOpen={deleteCarIndex !== null}
        vehicle={quoteDetail.vehicles[deleteCarIndex]}
        onCloseModal={() => setDeleteCarIndex(null)}
        onDeleteVehicle={() => {
          setEditCarIndex(null)
          processUpdateQuote({
            ...quoteDetail,
            vehicles: quoteDetail.vehicles.map((v, i) =>
              i === deleteCarIndex ? { ...v, status: 'Deleted' } : v,
            ),
          })
        }}
      />
      <EditDriverModal
        driverIndex={editDriverIndex}
        isOpen={editDriverIndex !== null}
        defaultValue={
          editDriverIndex === 'new'
            ? DefaultDriverInfo
            : quoteDetail.drivers[editDriverIndex]
        }
        onDeleteDriver={() => setDeleteDriverIndex(editDriverIndex)}
        onCloseModal={() => {
          if (editDriverIndex !== null && editDriverIndex !== 'new') {
            setReviewableItems(
              reviewableItems.filter(
                (id) => id !== quoteDetail.drivers[editDriverIndex].id,
              ),
            )
          }
          setEditDriverIndex(null)
        }}
        onCancel={() => {
          //if (editDriverIndex === 'new') {
            if (editDriverIndex !== null && editDriverIndex !== 'new') {
              setReviewableItems(
                reviewableItems.filter(
                  (id) => id !== quoteDetail.drivers[editDriverIndex].id,
                ),
              )
            }
            setEditDriverIndex(null)
          //} else {
            //setConfirmationRequired({ show: true, action: 'edit-driver' })
          //}
        }}
        onUpdate={(updatedValue) => {
          if (editDriverIndex === 'new') {
            setLoading(true)
            addDriver(getNewDriverParam(updatedValue))
              .then(() => setLoading(false))
              .catch((e) => {
                const { errorType, errorData } = e as CustomError
                setError(
                  [new CustomError(errorType, { ...(errorData || {}), quoteNumber })]
                )
              })
          } else {
              processUpdateQuote({
                ...quoteDetail,
                drivers: quoteDetail.drivers.map((v, i) =>
                  i === editDriverIndex ? updatedValue : v,
                ),
              })
              setEditDriverIndex(null)
          }
        }}
        onUpdateDriverPoints={(action, driverNumber, updatedDriverPoint) => {
          logger(updatedDriverPoint)
          processUpdateDriverPoints(action, driverNumber, updatedDriverPoint)
        }}
      />
      <DeleteDriverModal
        isOpen={deleteDriverIndex !== null}
        driver={quoteDetail.drivers[deleteDriverIndex]}
        onCloseModal={() => setDeleteDriverIndex(null)}
        onDeleteDriver={() => {
          setEditDriverIndex(null)
          processUpdateQuote({
            ...quoteDetail,
            drivers: quoteDetail.drivers.map((v, i) =>
              i === deleteDriverIndex ? { ...v, status: 'Deleted' } : v,
            ),
          })
        }}
      />
      {/*<ConfirmationModal
        isOpen={confirmationRequired.show}
        infoMessage={'You are about to exit the edit screen'}
        cancelButtonText={'Continue editing'}
        confirmationButtonText={'Discard changes'}
        onCancel={() => {
          setConfirmationRequired({show: false, action:'edit-driver'})          
        }}
        onConfirm={() => {
          quoteDetail.drivers[editDriverIndex].driverPoints = quoteDetail.drivers[editDriverIndex].driverPoints.filter(dp => dp.id)
          if (editDriverIndex !== null && editDriverIndex !== 'new') {
            setReviewableItems(
              reviewableItems.filter(
                (id) => id !== quoteDetail.drivers[editDriverIndex].id,
              ),
            )
          }
          setConfirmationRequired({show: false, action:'edit-driver'})      
          setEditDriverIndex(null)
        }} /> */} 

      <DiscountsModal
        isOpen={discountsModalVisible}
        lineInfo={quoteDetail.lineInfo}
        basicPolicyInfo={quoteDetail.basicPolicyInfo}
        onCloseModal={() => setDiscountsModalVisible(false)}
        onUpdate={(updatedLine, updatedBasicPolicy) => {
          processUpdateQuote({
            ...quoteDetail,
            lineInfo: updatedLine,
            basicPolicyInfo: updatedBasicPolicy
          })
        }}
      />
      <RequiredInformationModal
        isOpen={requiredInformationModalVisible}
        defaultValue={quoteDetail}
        onCloseModal={() => setRequiredInformationModalVisible(false)}
        onUpdate={(v) => {
          processUpdateQuote(v)
        }}
      />
      <AutoPolicyModal
        isOpen={autoPolicyModalVisible}
        defaultValue={quoteDetail.planInfo[selectedPlan]}
        onUpdatePlanInfo={(updatedPlanInfo) => {
          processUpdateQuote({
            ...quoteDetail,
            planInfo: {
              ...quoteDetail.planInfo,
              [selectedPlan]: updatedPlanInfo,
            },
          })
        }}
        onCloseModal={() => setAutoPolicyModalVisible(false)}
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
        onAppCloseOut={(lhInfo: Array<LossHistoryInfo>) => {
          processExternalApplicationCloseOut({
            ...quoteDetail,
            lossHistory: lhInfo
          })
        }}
      />
    </Screen>
  )
}
