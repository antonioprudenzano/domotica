SECTIONS
{
	@BODY(STANDARD,1SCORE)
}

SEGMENTS
{
	@SEGMENT1(1.0),
	@SEGMENT2(1.0)
}

TEMPLATE(LIGHT)
{
	@ROOM,
	@NAME,
	@BRIGHTNESS,
	@STATE
	MERGE WHEN SENTENCE

}
TEMPLATE(THERMOSTAT)
{
	@ROOM,
	@TEMPERATURE,
	@STATE
	MERGE WHEN SENTENCE
}