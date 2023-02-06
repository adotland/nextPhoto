import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaMountain, FaRulerHorizontal } from "react-icons/fa";
import RouteFilterHood from "./RouteFilterHood";
import RouteFilterSlider from "./RouteFilterSlider";

function RouteFilter({
  routeDataList,
  setFilteredRouteDataList,
  filters
}) {

  const MAX_DISTANCE = 30;
  const MAX_ELEVATION = 1000;

  const [distanceFilter, setDistanceFilter] = useState(MAX_DISTANCE);
  const [elevationFilter, setElevationFilter] = useState(MAX_ELEVATION);
  const [hoodFilter, setHoodFilter] = useState(filters.hood);

  useEffect(() => {
    let newRouteDataList = [];

    // distance
    if (distanceFilter < MAX_DISTANCE) {
      newRouteDataList = routeDataList.filter(d => Number(d.routeData?.distance) <= distanceFilter)
    } else {
      newRouteDataList = routeDataList
    }

    // elevation
    if (elevationFilter < MAX_ELEVATION) {
      newRouteDataList = newRouteDataList.filter(d => Number(d.routeData?.elevation?.pos) <= elevationFilter)
    } else {
      newRouteDataList = newRouteDataList
    }

    // hood
    const newFilteredRouteSet = new Set(newRouteDataList);
    newRouteDataList.forEach(route => {
      let exists = false;
      hoodFilter.forEach(hood => {
        if (route.hoodNameList.includes(hood)) {
          exists = true;
        }
      });
      if (!exists) {
        newFilteredRouteSet.delete(route)
      }
    });

    setFilteredRouteDataList(Array.from(newFilteredRouteSet));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distanceFilter, elevationFilter, hoodFilter])

  // function resetFilters() {
  //   setDistanceFilter(MAX_DISTANCE)
  //   setElevationFilter(MAX_ELEVATION)
  //   setHoodFilter(filters.hood)
  // }

  return (
    <Accordion defaultIndex={[]} allowMultiple allowToggle w={'100%'} mb={5}>
      <AccordionItem>
        <AccordionButton>
          <Box flex='1' textAlign='center'>
            Filters
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Flex flexDir={'column'} maxW={['90%', '90%', '50%']} m={'0 auto'} w={['90%', '90%', '50%']}>
            <RouteFilterSlider
              title={`Distance (mi)`}
              setFilterValue={setDistanceFilter}
              max={MAX_DISTANCE}
              step={10}
              icon={<FaRulerHorizontal />}
            />
            <RouteFilterSlider
              title={`Elevation (ft)`}
              setFilterValue={setElevationFilter}
              max={MAX_ELEVATION}
              step={100}
              icon={<FaMountain />}
            />
            <RouteFilterHood
              hoodFilter={filters.hood}
              setFilterValue={setHoodFilter}
            />
            {/* <Button onClick={resetFilters}>Reset</Button> */}
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )
}

export default RouteFilter
