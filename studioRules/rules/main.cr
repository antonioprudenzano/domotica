IMPORT "config.cr"

SCOPE SENTENCE
{
	DOMAIN(dom1)
	{
		TYPE(NPH, NPR)
	}
}

SCOPE SENTENCE
{
    IDENTIFY(LIGHT)
    {
        (@ROOM[ANCESTOR(100180516)] OR @ROOM[KEYWORD("living room")])
        AND
        LEMMA("light")
        AND
        @STATE[KEYWORD("on","off")]
        OR
        LEMMA("brightness")
        >
        @BRIGHTNESS[TYPE(NOU)]
        OR
        @NAME[KEYWORD("penisola", "piano cottura", "luce", "specchio", "comodino")]
    }

    IDENTIFY(LIGHT)
    {
        @STATE[KEYWORD("on","off")]
        >
        @NAME[KEYWORD("penisola", "piano cottura", "luce", "specchio", "comodino")]
    }
    IDENTIFY(LIGHT)
    {
        @STATE[KEYWORD("on","off")]
        >
        @NAME[KEYWORD("penisola", "piano cottura", "luce", "specchio", "comodino")]
        AND
        (@ROOM[ANCESTOR(100180516)] OR @ROOM[KEYWORD("living room")])
    }
}

SCOPE SENTENCE
{
    IDENTIFY(LIGHT)
    {
        LEMMA("brightness")
        AND
        LEMMA("set")
        >>
        @ROOM[ANCESTOR(100180516)] OR @ROOM[KEYWORD("living room")]
        AND
        LEMMA("brightness")
        >
        @BRIGHTNESS[TYPE(PCT)]
    }

    IDENTIFY(THERMOSTAT)
    {
        LEMMA("thermostat", "temperature")
        AND
        (@ROOM[ANCESTOR(100180516)] OR @ROOM[KEYWORD("living room")])
        AND
        @TEMPERATURE[ANCESTOR(59188)]
    }
}